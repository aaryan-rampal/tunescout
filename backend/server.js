// server.js
import express from 'express'
import axios from 'axios'
import cors from 'cors'
import { get } from 'http';

const app = express();
const port = 3001; // You can choose a different port
app.use(express.json()); // To parse JSON request bodies
app.use(cors())

const tokenStore = {}
// Define routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Endpoint to get user's recently played tracks
app.post('/api/recently-played', async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
      return res.status(400).json({ message: 'Access token is required' });
  }

  try {
      // Make a request to Spotify's API
      const spotifyResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${access_token}`, // Send the access token
          },
      });

      // Check for errors from Spotify API
      if (!spotifyResponse.ok) {
          const error = await spotifyResponse.json();
          return res.status(spotifyResponse.status).json({ message: error.error.message });
      }

      // Parse and send the response
      const data = await spotifyResponse.json();
      
      // Remove duplicates from the list of tracks
      const uniqueTracks = Array.from(new Map(data.items.map(item => [item.track.id, item])).values());
      const filteredTracks = uniqueTracks.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map(artist => artist.name).join(', '),
        image: item.track.album.images[0]?.url || '', // Get the first image from the album
    }));
      get_top_tracks(access_token)
      res.status(200).json(filteredTracks); // Send the tracks back to the client
  } catch (error) {
      console.error('Error fetching recently played tracks:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/song-interaction', (req, res) => {
  const { songId, action } = req.body;

  if (!songId || !action) {
      return res.status(400).json({ message: 'Song ID and action are required' });
  }

  console.log(`Received interaction: ${action} for song ID: ${songId}`);
  res.status(200).json({ message: 'Interaction received successfully' });
});

const get_top_tracks = async (access_token) => {
  try{
      const spotifyResponse = await fetch('https://api.spotify.com/v1/me/top/tracks', {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${access_token}`, // Send the access token
          },
      });

      // Check for errors from Spotify API
      if (!spotifyResponse.ok) {
          const error = await spotifyResponse.json();
          return res.status(spotifyResponse.status).json({ message: error.error.message });
      }

      // Parse and send the response
      const data = await spotifyResponse.json();
      console.log(data)
  } catch (error) {
      console.error('Error fetching top tracks:', error);
  }
}