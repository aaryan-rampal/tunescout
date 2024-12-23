// server.js
import express from 'express'

const app = express();
const port = 3001; // You can choose a different port

// Middleware (if needed)
// app.use(express.json()); // To parse JSON request bodies

// Define routes
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});