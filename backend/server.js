// server.js
import express from 'express'
import axios from 'axios'
import cors from 'cors'

const app = express();
const port = 3001; // You can choose a different port
app.use(express.json()); // To parse JSON request bodies
app.use(cors())

// Define routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post('/api/authenticate', async (req, res) => {
  const {access_token } = req.body;
  console.log('hello')
  // console.log(access_token)
  res.json({ userData: res.data });
});