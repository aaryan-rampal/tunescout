import { Request, Response, Router } from "express";
import "../loadEnv.js";

const LASTFM_API_KEY = process.env.VITE_LASTFM_API_KEY;
export const spotifyRoutes = Router();

spotifyRoutes.post("/get_playlists", async (req, res) => {
  console.log("hello");
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ message: error.error.message });
    }

    const data = await response.json();
    // TODO: why does this repeat twice?
    // console.log("got here");

    // TODO: some playlists wont have images
    const playlists = data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      image:
        playlist.images && playlist.images[0] ? playlist.images[0].url : "",
    }));

    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function fetchAllPlaylistTracks(playlist_id, access_token) {
  const allTracks = [];
  let nextUrl = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;

  try {
    // Loop until there are no more pages
    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Spotify API error: ${error.error.message}`);
      }

      const data = await response.json();

      // Add current page tracks to the array
      allTracks.push(...data.items);

      // Update the next URL for pagination
      nextUrl = data.next; // `null` if no more pages
    }

    // Extract relevant track information
    const trackDetails = allTracks.map((item) => ({
      name: item.track.name,
      // TODO: this might be a problem later on
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      album: item.track.album.name,
      id: item.track.id,
    }));

    return trackDetails;
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    throw error; // Rethrow to handle it in the calling function
  }
}

const removeInvalid = (similarTracks, ogTracks) => {
  // Create a set of original playlist tracks
  const ogTracksSet = new Set();
  ogTracks.forEach((track) => {
    const trackKey = `${track.name}|${track.artist}`;
    ogTracksSet.add(trackKey);
  });

  const uniqueTracks = new Set();
  const filteredTracks = similarTracks.filter((track) => {
    const trackKey = `${track.name}|${track.artist.name}`;

    // Check if the track already exists in the unique set or original playlist
    if (uniqueTracks.has(trackKey) || ogTracksSet.has(trackKey)) {
      return false;
    }

    // Add track to the unique set
    uniqueTracks.add(trackKey);
    return true;
  });

  return filteredTracks;
};

const minSimilarityScore = 0.85;

const convertToSpotify = async (similarTracks, access_token) => {
  const fetchSpotifyTrackId = async (trackName, artistName) => {
    try {
      const url = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
        trackName
      )}%20artist:${encodeURIComponent(artistName)}&type=track&limit=1`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "spotifyRouteslication/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch track "${trackName}" by "${artistName}"`
        );
        console.error("Response status:", response.status);
        return null;
      }

      const data = await response.json();
      const track = data.tracks.items[0];
      const image = track.album.images[0].url;
      const runtime = track.duration_ms;
      const id = track.id;
      const uri = track.uri;
      return { name: trackName, artist: artistName, image, runtime, id, uri }; // Return the image
    } catch (error) {
      console.error("Error fetching Spotify track ID:", error);
      return null;
    }
  };

  const spotifyTrackPromises = similarTracks.map(async (track) => {
    // console.log(track)
    const name = track.name;
    const artist = track.artist.name;
    console.log(`Processing track: ${name} by ${artist}`);
    const spotifyTrack = await fetchSpotifyTrackId(name, artist);
    if (spotifyTrack) {
      return spotifyTrack; // Return the track object
    } else {
      console.warn(`No Spotify ID found for track: "${name}" by "${artist}"`);
      return null; // Return null for tracks with no Spotify ID
    }
  });

  const resolvedTracks = await Promise.all(spotifyTrackPromises);

  const spotifyTracks = resolvedTracks.filter((track) => track !== null);

  // console.log(spotifyTracks);
  return spotifyTracks;
};

spotifyRoutes.post("/generate_playlist", async (req, res) => {
  const { playlist_id, access_token, number_of_refreshes, number_of_songs } =
    req.body;
  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }
  if (!playlist_id) {
    return res.status(400).json({ message: "Playlist ID is required" });
  }
  try {
    const playlistData = await fetchAllPlaylistTracks(
      playlist_id,
      access_token
    );

    const tracks = playlistData.map((item) => ({
      name: item.name,
      // TODO: Make this more robust to multiple artists
      artist: item.artist, // Get the first artist
    }));

    if (tracks.length < 10) {
      return res
        .status(400)
        .json({ message: "Playlist does not have enough tracks" });
    }

    const allSimilarTracks = [];

    // Fetch similar tracks from Last.fm for each track
    const similarTracksPromises = tracks.map(async (track) => {
      const lastFmResponse = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(
          track.artist
        )}&track=${encodeURIComponent(
          track.name
        )}&api_key=${LASTFM_API_KEY}&format=json`
      );

      const similarData = await lastFmResponse.json();
      const similarityScore = Math.max(
        0.65,
        minSimilarityScore - number_of_refreshes * 0.05
      );
      const filteredTracks = (similarData.similartracks?.track || []).filter(
        (track) => parseFloat(track.match || 0) > similarityScore
      );

      allSimilarTracks.push(...filteredTracks);
    });

    // Wait for all similar track requests to complete
    await Promise.all(similarTracksPromises);
    const filteredSimilarTracks = removeInvalid(allSimilarTracks, tracks);

    const spotifyTracks = await convertToSpotify(
      filteredSimilarTracks,
      access_token
    );

    // console.log(spotifyTracks)

    const similarTracksResults = getRandomValuesFromList(
      spotifyTracks,
      number_of_songs
    );
    // console.log(similarTracksResults);

    res.status(200).json(similarTracksResults);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getRandomValuesFromList = (list, x) => {
  // If the list length is less than x, return the entire list
  if (list.length <= x) {
    return list;
  }

  const shuffledList = list.sort(() => 0.5 - Math.random());
  return shuffledList.slice(0, x);
};

spotifyRoutes.post("/create_playlist", async (req, res) => {
  const { access_token, tracks, name } = req.body;
  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }
  if (!tracks) {
    return res.status(400).json({ message: "Tracks are required" });
  }
  if (!name) {
    return res.status(400).json({ message: "Playlist name is required" });
  }

  try {
    // Create a new playlist
    const createPlaylistResponse = await fetch(
      "https://api.spotify.com/v1/me/playlists",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          name: name,
          description: "Generated by TuneScout",
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      const error = await createPlaylistResponse.json();
      return res
        .status(createPlaylistResponse.status)
        .json({ message: error.error.message });
    }

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;

    // Add tracks to the new playlist
    console.log(tracks[0].uri);
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          uris: tracks.map((track) => track.uri),
        }),
      }
    );

    if (!addTracksResponse.ok) {
      const error = await addTracksResponse.json();
      console.log("error here");
      console.log(error);
      return res
        .status(addTracksResponse.status)
        .json({ message: error.error.message });
    }

    console.log("good here");
    res
      .status(200)
      .json({ message: "Playlist created successfully", playlistId });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
