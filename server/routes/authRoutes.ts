// filepath: /Users/emmanuelsarpong/Documents/GitHub/waypoint/Server/routes/authRoutes.ts
import express from "express";
import { signup, login } from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

// POST: Signup a new user
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  signup
);

// POST: Login a user
router.post("/login", login);

export default router;