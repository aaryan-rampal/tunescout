import { Request, Response, Router } from "express";
import * as spotifyService from "../services/spotifyService";
import "../loadEnv.js";
import { Track } from "../types";

const LASTFM_API_KEY = process.env.VITE_LASTFM_API_KEY;

// ✅ Get user playlists
export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const { access_token } = req.body;
    if (!access_token)
      return res.status(400).json({ message: "Access token is required" });

    const playlists = await spotifyService.getUserPlaylists(access_token);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Generate playlist (fetch similar tracks, convert to Spotify format)
export const generatePlaylist = async (req: Request, res: Response) => {
  try {
    const { playlist_id, access_token, number_of_songs } = req.body;
    if (!access_token || !playlist_id)
      throw new Error("Missing required fields");

    const originalTracks = await spotifyService.fetchAllPlaylistTracks(
      playlist_id,
      access_token
    );
    if (originalTracks.length < 10)
      throw new Error("Playlist does not have enough tracks");

    // TODO: sometimes, similarTracks.length < number_of_songs
    const similarTracks: Track[] = await spotifyService.fetchEnoughSimilarTracks(originalTracks, number_of_songs);
    const removeTracks = getRandomValuesFromList(
      similarTracks,
      number_of_songs
    );
    const finalTracks = await convertToSpotify(removeTracks, access_token);

    res.status(200).json(finalTracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new Spotify playlist & add tracks
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { access_token, tracks, name } = req.body;
    if (!access_token || !tracks || !name)
      throw new Error("Missing required fields");

    const playlistData = await spotifyService.createPlaylist(
      name,
      access_token
    );
    await spotifyService.addTracksToPlaylist(
      playlistData.id,
      tracks.map((track) => track.uri),
      access_token
    );

    res.status(200).json({
      message: "Playlist created successfully",
      playlistId: playlistData.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Helper functions (moved from main code)
const convertToSpotify = async (similarTracks, access_token) => {
  const spotifyTrackPromises = similarTracks.map(async (track) => {
    return await spotifyService.fetchSpotifyTrackId(
      track.name,
      track.artist.name,
      access_token
    );
  });

  const resolvedTracks = await Promise.all(spotifyTrackPromises);
  return resolvedTracks.filter((track) => track !== null);
};

const getRandomValuesFromList = (list, x) => {
  return list.length <= x
    ? list
    : list.sort(() => 0.5 - Math.random()).slice(0, x);
};
