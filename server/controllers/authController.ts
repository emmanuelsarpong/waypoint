import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import winston from "winston";
import User from "../models/userModel";

// Winston logger setup
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

// Mock database (replace with actual database logic)
const users: { username: string; password: string }[] = [];

// Signup a new user
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the user to the database
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: "User signed up successfully" });
});

// Login a user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Compare the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.status(200).json({ message: "User logged in successfully", token });
});

// Global error handler for uncaught errors
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: "An unexpected error occurred" });
};