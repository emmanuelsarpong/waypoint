import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import winston from "winston";
import User from "../models/userModel";
import { emailService } from "../services/emailService";
import crypto from "crypto";
import Stripe from "stripe";

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Signup a new user
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { email, password, confirmPassword, firstName } = req.body;

  if (!email || !password || !confirmPassword || !firstName) {
    return res.status(400).json({
      error: "Missing email, password, confirm password, or first name",
    });
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
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
      firstName,
    });

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: firstName,
    });
    newUser.stripeCustomerId = customer.id;
    await newUser.save();

    try {
      await emailService.sendVerificationEmail(email, verificationToken);
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
    return res
      .status(400)
      .json({ status: "error", error: "Invalid or missing token." });
  }

  // Find user with matching token and not already verified
  const user = await User.findOne({
    verificationToken: token,
    isVerified: false,
  });

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
  if (
    !user.verificationTokenExpires ||
    user.verificationTokenExpires < new Date()
  ) {
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

  if (!user.password) {
    // Handle the case where the user does not have a password set
    return res.status(400).json({ message: "No password set for this user." });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({ message: "You are logged in successfully.", token });
});

// Forgot Password (real implementation)
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        userFound: false,
        message: "We could not find an account with that email address.",
      });
    }

    // Generate a secure reset token and expiry
    const resetToken = crypto.randomBytes(32).toString("base64url");
    const resetTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = resetTokenExpires;
    await user.save();

    // Send email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
    } catch (emailErr) {
      logger.error("Password reset email failed:", emailErr);
      // Optionally clear the token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      await user.save();
      return res
        .status(500)
        .json({ error: "Failed to send reset email. Please try again later." });
    }

    res.json({
      userFound: true,
      message:
        "A password reset link has been sent to your email. Please check your inbox.",
    });
  }
);

// Reset Password (stub)
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { password, token } = req.body;
  if (!password || !token) {
    return res.status(400).json({ error: "Missing password or token." });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully." });
});

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
  res.status(200).json({ users });
});
