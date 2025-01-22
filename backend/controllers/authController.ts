import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { findUserByUsername, createUser } from "../database";

dotenv.config();

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store in .env

/**
 * ✅ Login User with `username`
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Find user by `username`
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token (valid for 7 days)
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "7d" });

    res.status(200).json({ success: true, message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Register New User with `username`
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user in database
    await createUser(username, hashedPassword);

    res.status(201).json({ success: true, message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
