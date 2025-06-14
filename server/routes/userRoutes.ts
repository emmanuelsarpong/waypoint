import express from "express";
import { protect } from "../middleware/authMiddleware";
import { updateProfile } from "../controllers/userController";
import { catchAsync } from "../utils/catchAsync";
import { Request, Response, RequestHandler } from "express";

const router = express.Router();

// PUT /user/profile
router.put("/profile", protect, catchAsync(updateProfile));

// GET /user/profile - get current user's profile
router.get(
  "/profile",
  protect,
  async (req: Request, res: Response): Promise<void> => {
    // req.user should be set by protect middleware
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized: No user in request" });
      return;
    }
    // Only return safe fields
    res.json({
      firstName: req.user.firstName,
      email: req.user.email,
      stripeCustomerId: req.user.stripeCustomerId,
    });
  }
);

export default router;
