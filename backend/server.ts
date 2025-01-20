// server.js
import express from "express";
import cors from "cors";
import "./loadEnv.js";
import { prisma } from "./database";
import { spotifyRoutes } from "./routes/spotifyRoutes";
import { authRoutes } from "./routes/authRoutes";

const app = express();
app.use(express.json()); // To parse JSON request bodies
app.use(cors());


app.use("/spotify", spotifyRoutes);
app.use("/auth", authRoutes);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});

const port = process.env.PORT || 3001;
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
