import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});

export default router;
