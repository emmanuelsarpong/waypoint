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
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.json({
      firstName: (req.user as any).firstName,
      email: req.user.email,
      stripeCustomerId: (req.user as any).stripeCustomerId,
    });
  }
);

export default router;
