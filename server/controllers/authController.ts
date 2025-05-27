import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import winston from "winston";
import User from "../models/userModel";
import { sendEmail } from "../services/emailService";
import { signupTemplate } from "../templates/signupTemplate";
import { forgotPasswordTemplate } from "../templates/forgotPasswordTemplate";

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
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "Missing username, password, or email" });
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

  // Generate a verification link (example)
  const verificationToken = "some-token"; // Generate a real token in production
  const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;

  // Send verification email
  await sendEmail({
    to: email,
    subject: "Verify your Waypoint account",
    html:
      signupTemplate(username) +
      `<p style="margin-top:20px;"><a href="${verificationLink}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Account</a></p>`,
  });

  res.status(201).json({
    message:
      "Signup successful! Please check your email to verify your account.",
  });
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

// Reset password
export const resetPassword = (req: Request, res: Response) => {
  // Password logic here
  res.json({ message: "Password reset endpoint" });
};

// Forgot password
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found with that email." });
    }

    // Generate reset token and link
    const resetToken = "reset-token"; // Generate a real token in production
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send reset email
    await sendEmail({
      to: email,
      subject: "Reset your Waypoint password",
      html: forgotPasswordTemplate(user.username, resetLink),
    });

    res.json({
      message: "Password reset email sent. Please check your inbox.",
    });
  }
);

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
