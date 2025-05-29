import express from "express";
import {
  signup,
  login,
  resetPassword,
  forgotPassword,
  verifyEmail,
} from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

// POST: Signup a new user
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  signup
);

// POST: Login a user
router.post("/login", login);

// GET: Verify email
router.get("/verify-email", verifyEmail);

// POST: Reset password
router.post("/reset-password", resetPassword);

// POST: Forgot password
router.post("/forgot-password", forgotPassword);

export default router;
