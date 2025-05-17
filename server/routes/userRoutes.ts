import express from "express";
import { protect } from "../middleware/authMiddleware";
import { updateProfile } from "../controllers/userController";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

// PUT /user/profile
router.put("/profile", protect, catchAsync(updateProfile));

export default router;
