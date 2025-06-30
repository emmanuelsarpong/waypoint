import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  createWorkout,
  getUserWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} from "../controllers/workoutController";

const router = express.Router();

// All workout routes require authentication
router.use(protect);

// POST /api/workouts - Create new workout (from Apple Watch/iPhone)
router.post("/", createWorkout);

// GET /api/workouts - Get user's workouts with filtering/pagination
router.get("/", getUserWorkouts);

// GET /api/workouts/stats - Get user's workout statistics
router.get("/stats", getWorkoutStats);

// GET /api/workouts/:id - Get specific workout details
router.get("/:id", getWorkoutById);

// PUT /api/workouts/:id - Update workout (name, notes, etc.)
router.put("/:id", updateWorkout);

// DELETE /api/workouts/:id - Delete workout
router.delete("/:id", deleteWorkout);

export default router;
