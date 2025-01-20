import { Router } from "express";
import * as spotifyController from "../controllers/spotifyController";

export const spotifyRoutes = Router();

spotifyRoutes.post("/get_playlists", spotifyController.getUserPlaylists);
spotifyRoutes.post("/generate_playlist", spotifyController.generatePlaylist);
spotifyRoutes.post("/create_playlist", spotifyController.createPlaylist);
