import { Request, Response } from "express";
import User from "../models/userModel";

export const updateProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { username, password } = req.body;
  const update: any = {};
  if (username) update.username = username;
  if (password) update.password = password; 


  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ message: "Profile updated", user });
};
