import express from "express";
import { signup, login, resetPassword } from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

// POST: Signup a new user
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  signup
);

// POST: Login a user
router.post("/login", login);

// POST: Reset password
router.post("/reset-password", resetPassword);

export default router;
