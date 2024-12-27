// server.js
import express from "express";
import cors from "cors";
import "./loadEnv.js";
import { spotifyRoutes } from "./controllers/spotifyController.ts";

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors());

app.use("/spotify", spotifyRoutes);

const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
