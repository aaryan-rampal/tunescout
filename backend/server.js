// server.js
import express from "express";
import cors from "cors";
import "./loadEnv.js";
// import { access } from "fs";

const app = express();
const port = 3001;
const LASTFM_API_KEY = process.env.VITE_LASTFM_API_KEY;
const SPOTIFY_CLIENT_ID = process.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;
app.use(express.json()); // To parse JSON request bodies
app.use(cors());

// Define routes
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post("/api/store_access_token", async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  res.status(200).json({ message: "Access token stored" });
})

app.post("/api/get_playlists", async (req, res) => {
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

const convertToSpotify = async (similarTracks) => {
  const fetchSpotifyTrackId = async (trackName, artistName) => {
    try {
      const url = `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(
        trackName
      )}%20artist:${encodeURIComponent(artistName)}&type=track&limit=1`;

      // TODO: need access token in the backend
      const access_token = "";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
      return data.tracks.items[0]?.id || null; // Return the Spotify ID
    } catch (error) {
      console.error("Error fetching Spotify track ID:", error);
      return null;
    }
  };

  const spotifyTrackPromises = similarTracks.map(async (track) => {
    // const { name, artist } = track;
    const name = track.name;
    const artist = track.artist.name;
    console.log(`Processing track: ${name} by ${artist}`);
    const spotifyId = await fetchSpotifyTrackId(name, artist);
    if (spotifyId) {
      return { name, artist, spotifyId }; // Return the track object
    } else {
      console.warn(`No Spotify ID found for track: "${name}" by "${artist}"`);
      return null; // Return null for tracks with no Spotify ID
    }
  });

  const resolvedTracks = await Promise.all(spotifyTrackPromises);
  console.log(resolvedTracks);
  const spotifyTracks = resolvedTracks.filter((track) => track !== null);
  return spotifyTracks;
};

app.post("/api/generate_playlist", async (req, res) => {
  const { playlist_id, access_token } = req.body;
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
      const filteredTracks = (similarData.similartracks?.track || []).filter(
        (track) => parseFloat(track.match || 0) > minSimilarityScore
      );

      allSimilarTracks.push(...filteredTracks);
    });

    // Wait for all similar track requests to complete
    await Promise.all(similarTracksPromises);
    const filteredSimilarTracks = removeInvalid(allSimilarTracks, tracks);

    const spotifyTracks = await convertToSpotify(filteredSimilarTracks);

    // TODO: 10 is a random value here, make it a parameter
    const similarTracksResults = getRandomValuesFromList(
      filteredSimilarTracks,
      10
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
