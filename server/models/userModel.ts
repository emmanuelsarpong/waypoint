import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  firstName?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  googleId?: string;
  microsoftId?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
}

const userSchema = new Schema<IUser>({
  googleId: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  firstName: { type: String, required: false },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
  microsoftId: { type: String },
  stripeCustomerId: { type: String },
  subscriptionStatus: { type: String, default: "inactive" },
});

export default mongoose.model<IUser>("User", userSchema);
