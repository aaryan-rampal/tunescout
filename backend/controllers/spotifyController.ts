import { Request, Response } from "express";
import * as spotifyService from "../services/spotifyService";
import "../loadEnv.js";
import { Track } from "../types.js";
import dotenv from "dotenv";
import prisma from 'prisma'
import axios from 'axios'

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!; // Backend Redirect URI
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

export const loginWithSpotify = (req: Request, res: Response) => {
  console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
  const authURL = `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES.join(" "))}`;

  res.redirect(authURL);
};

export const handleSpotifyCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Authorization code is missing" });

    // Request access token from Spotify
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );


    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch user's Spotify ID using the access token
    const userProfile = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const spotifyId = userProfile.data.id;

    // Redirect to frontend with a success flag (store session in frontend)
    // res.redirect(`${process.env.FRONTEND_URL}/tunescout/dashboard?sucess=True`);
    res.redirect(`${process.env.FRONTEND_URL}/tunescout/dashboard`);
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to authenticate with Spotify" });
  }
};

export const refreshSpotifyToken = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "User email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.spotifyRefreshToken)
      return res.status(401).json({ message: "User is not authenticated with Spotify" });

    // Request new access token
    const tokenResponse = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // Update access token in database
    await prisma.user.update({
      where: { email },
      data: { spotifyAccessToken: access_token }
    });

    res.status(200).json({ access_token });
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to refresh Spotify token" });
  }
};

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

    const similarTracks: Track[] =
      await spotifyService.fetchEnoughSimilarTracks(
        originalTracks,
        number_of_songs
      );
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
