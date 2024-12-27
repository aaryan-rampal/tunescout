import { Router } from 'express';
import { handleAuthCallback } from '../controllers/spotifyController';

const router = Router();

// Spotify authentication callback route
router.post('/auth/callback', handleAuthCallback);

export default router;
