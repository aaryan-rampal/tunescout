import { Router } from "express";
import * as authController from "../controllers/authController"

export const authRoutes = Router();

authRoutes.post("/login", authController.loginUser);
authRoutes.post("/register", authController.registerUser);