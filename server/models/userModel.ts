import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  firstName: string; 
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  firstName: { type: String, required: true }, 
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
});

export default mongoose.model<IUser>("User", userSchema);
