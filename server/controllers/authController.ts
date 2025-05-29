import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import winston from "winston";
import User from "../models/userModel";
import { sendEmail } from "../services/emailService";
import { signupTemplate } from "../templates/signupTemplate";
import { forgotPasswordTemplate } from "../templates/forgotPasswordTemplate";
import crypto from "crypto";

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

// Signup a new user
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Missing email, password, or confirm password" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a URL-safe, shorter verification token
  const verificationToken = crypto.randomBytes(16).toString("base64url");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    const verificationLink = `http://localhost:5173/verify-email?token=${encodeURIComponent(
      verificationToken
    )}`;

    try {
      await sendEmail({
        to: email,
        subject: "Verify your Waypoint account",
        html:
          signupTemplate(email) +
          `<p style="margin-top:20px;"><a href="${verificationLink}" style="background:#4f46e5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Account</a></p>`,
      });
    } catch (emailErr) {
      logger.error("Email sending failed:", emailErr);
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({
        error: "Failed to send verification email. Please try again later.",
      });
    }

    res.status(201).json({
      message:
        "Signup successful! Please check your email to verify your account.",
    });
  } catch (err: any) {
    logger.error("Signup error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Verify email
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ status: "error", error: "Invalid or missing token." });
  }

  // Find user by token or by isVerified
  const user = await User.findOne({ $or: [{ verificationToken: token }, { isVerified: true }] });

  // If user is already verified, return early
  if (user && user.isVerified) {
    return res.status(400).json({
      status: "error",
      error: "Email already verified. Please log in.",
      alreadyVerified: true,
    });
  }

  // If no user found by token, it's invalid
  if (!user) {
    return res.status(400).json({
      status: "error",
      error: "Token is invalid.",
    });
  }

  // Check if token is expired
  if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
    return res.status(400).json({
      status: "error",
      error: "Token has expired. Please sign up again.",
    });
  }

  // Mark user as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({
    status: "success",
    message: "Email verified successfully. You can now log in.",
  });
});

// Login
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res
      .status(401)
      .json({ error: "Please verify your email before logging in." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.status(200).json({ message: "User logged in successfully", token });
});

// Forgot Password (stub)
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found with that email." });
    }

    const resetToken = "reset-token";
    res.json({ message: "Password reset email sent (stub)." });
  }
);

// Reset Password (stub)
export const resetPassword = (req: Request, res: Response) => {
  res.json({ message: "Password reset endpoint" });
};

// Error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: "Internal server error" });
};

// Debugging: Log all users (temporary)
export const logAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find({});
  console.log("All users:", users);
  res.status(200).json({ users });
});
