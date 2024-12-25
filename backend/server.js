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

app.post('/api/get_playlists', async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ message: 'Access token is required' });
    }

    try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            return res.status(response.status).json({ message: error.error.message });
        }

        const data = await response.json();
        console.log('Data:', data.items[0].images[0].url);

        // TODO: some playlists wont have images
        const playlists = data.items.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            image: playlist.images && playlist.images[0] ? playlist.images[0].url : '',
        }));

        res.status(200).json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/generate_playlist', async (req, res) => {
    const { playlist_id, access_token } = req.body;
    if (!access_token) {
        return res.status(400).json({ message: 'Access token is required' });
    }

    try {
        // const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${access_token}`,
        //     },
        // });

        // if (!response.ok) {
        //     const error = await response.json();
        //     return res.status(response.status).json({ message: error.error.message });
        // }

        // const data = await response.json();
        // console.log('Data:', data.items[0].images[0].url);

        // // TODO: some playlists wont have images
        // const playlists = data.items.map((playlist) => ({
        //     id: playlist.id,
        //     name: playlist.name,
        //     image: playlist.images && playlist.images[0] ? playlist.images[0].url : '',
        // }));

        // res.status(200).json(playlists);
        console.log('playlist_id:', playlist_id);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})