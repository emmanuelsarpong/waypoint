import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";

/**
 * Get the current user's profile.
 * Assumes req.user is set by authentication middleware.
 */
export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await User.findById(userId).select(
    "_id email username firstName lastName stripeCustomerId"
  );
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

/**
 * Update the current user's profile.
 */
export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { firstName, password } = req.body;
  const update: any = {};

  if (firstName) update.firstName = firstName;
  if (password) {
    // Hash the new password before saving
    update.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ message: "Profile updated", user });
};
