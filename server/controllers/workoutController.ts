import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import Workout from "../models/workoutModel";
import mongoose from "mongoose";

// Workout data interface (matches what Apple Watch app will send)
interface WorkoutData {
  name: string;
  sport: "running" | "cycling" | "hiking" | "walking";
  startTime: string; // ISO string
  endTime: string;
  coordinates: Array<{
    lat: number;
    lng: number;
    timestamp: string;
    elevation?: number;
    speed?: number;
    heartRate?: number;
  }>;
  stats: {
    distance: number; // km
    duration: number; // seconds
    avgPace?: string; // min/km for running/hiking
    avgSpeed?: string; // km/h for cycling
    maxSpeed?: number;
    elevationGain: number; // meters
    elevationLoss: number;
    calories: number;
    avgHeartRate?: number;
    maxHeartRate?: number;
    steps?: number; // For running/hiking
  };
  source: "apple_watch" | "iphone" | "web_app";
}

// POST /api/workouts - Create new workout
export const createWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const workoutData: WorkoutData = req.body;

  // Validate required fields
  if (
    !workoutData.name ||
    !workoutData.sport ||
    !workoutData.coordinates ||
    !workoutData.stats
  ) {
    return res.status(400).json({
      status: "error",
      message: "Missing required workout data",
    });
  }

  // Convert coordinate timestamps to Date objects
  const coordinates = workoutData.coordinates.map((coord) => ({
    ...coord,
    timestamp: new Date(coord.timestamp),
  }));

  // Create new workout in database
  const newWorkout = await Workout.create({
    userId: new mongoose.Types.ObjectId(userId),
    name: workoutData.name,
    sport: workoutData.sport,
    startTime: new Date(workoutData.startTime),
    endTime: new Date(workoutData.endTime),
    coordinates,
    stats: workoutData.stats,
    source: workoutData.source,
  });

  res.status(201).json({
    status: "success",
    data: {
      workout: newWorkout,
    },
  });
});

// GET /api/workouts - Get user's workouts with filtering
export const getUserWorkouts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;
    const { sport, page = 1, limit = 20, sortBy = "createdAt" } = req.query;

    // Build query
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    // Filter by sport if specified
    if (sport && sport !== "all") {
      query.sport = sport;
    }

    // Build sort object
    let sortObj: any = { createdAt: -1 }; // Default: newest first
    if (sortBy === "distance") {
      sortObj = { "stats.distance": -1 };
    } else if (sortBy === "duration") {
      sortObj = { "stats.duration": -1 };
    }

    // Execute query with pagination
    const skip = (Number(page) - 1) * Number(limit);
    const [userWorkouts, totalCount] = await Promise.all([
      Workout.find(query).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
      Workout.countDocuments(query),
    ]);

    res.json({
      status: "success",
      results: userWorkouts.length,
      totalWorkouts: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      data: {
        workouts: userWorkouts,
      },
    });
  }
);

// GET /api/workouts/stats - Get user's workout statistics
export const getWorkoutStats = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;

    // Get all user workouts for stats calculation
    const userWorkouts = await Workout.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (userWorkouts.length === 0) {
      return res.json({
        status: "success",
        data: {
          totalWorkouts: 0,
          totalDistance: 0,
          totalDuration: 0,
          totalCalories: 0,
          totalSteps: 0,
          avgDistance: 0,
          avgDuration: 0,
          sportBreakdown: {},
          recentRoutes: [],
          weeklyData: [],
        },
      });
    }

    // Calculate aggregate stats
    const stats = userWorkouts.reduce(
      (acc, workout) => {
        acc.totalDistance += workout.stats.distance;
        acc.totalDuration += workout.stats.duration;
        acc.totalCalories += workout.stats.calories;
        acc.totalSteps += workout.stats.steps || 0;

        // Sport breakdown
        if (!acc.sportBreakdown[workout.sport]) {
          acc.sportBreakdown[workout.sport] = {
            count: 0,
            distance: 0,
            duration: 0,
            calories: 0,
          };
        }
        acc.sportBreakdown[workout.sport].count++;
        acc.sportBreakdown[workout.sport].distance += workout.stats.distance;
        acc.sportBreakdown[workout.sport].duration += workout.stats.duration;
        acc.sportBreakdown[workout.sport].calories += workout.stats.calories;

        return acc;
      },
      {
        totalDistance: 0,
        totalDuration: 0,
        totalCalories: 0,
        totalSteps: 0,
        sportBreakdown: {} as any,
      }
    );

    // Get recent routes (last 5)
    const recentRoutes = userWorkouts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((workout) => ({
        id: workout._id,
        name: workout.name,
        sport: workout.sport,
        distance: workout.stats.distance,
        date: workout.createdAt,
        duration: workout.stats.duration,
        calories: workout.stats.calories,
      }));

    // Generate weekly data (last 7 days)
    const weeklyData = generateWeeklyData(userWorkouts);

    res.json({
      status: "success",
      data: {
        totalWorkouts: userWorkouts.length,
        totalDistance: Math.round(stats.totalDistance * 10) / 10,
        totalDuration: stats.totalDuration,
        totalCalories: stats.totalCalories,
        totalSteps: stats.totalSteps,
        avgDistance:
          Math.round((stats.totalDistance / userWorkouts.length) * 10) / 10,
        avgDuration: Math.round(stats.totalDuration / userWorkouts.length),
        sportBreakdown: stats.sportBreakdown,
        recentRoutes,
        weeklyData,
      },
    });
  }
);

// Helper function to generate weekly data
function generateWeeklyData(workouts: any[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = days.map((day) => ({ name: day, value: 0 }));

  const now = new Date();
  const weekStart = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 7 days ago

  workouts.forEach((workout) => {
    const workoutDate = new Date(workout.createdAt);
    if (workoutDate >= weekStart) {
      const dayIndex = (workoutDate.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      weeklyData[dayIndex].value += workout.stats.distance;
    }
  });

  return weeklyData.map((day) => ({
    ...day,
    value: Math.round(day.value * 10) / 10,
  }));
}

// GET /api/workouts/:id - Get specific workout
export const getWorkoutById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).id;
    const workoutId = req.params.id;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid workout ID format",
      });
    }

    const workout = await Workout.findOne({
      _id: new mongoose.Types.ObjectId(workoutId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (!workout) {
      return res.status(404).json({
        status: "error",
        message: "Workout not found",
      });
    }

    res.json({
      status: "success",
      data: {
        workout,
      },
    });
  }
);

// PUT /api/workouts/:id - Update workout
export const updateWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const workoutId = req.params.id;
  const updates = req.body;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid workout ID format",
    });
  }

  // Update allowed fields (name, sport, etc.)
  const allowedUpdates = ["name", "sport"];
  const filteredUpdates: any = {};

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  const workout = await Workout.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(workoutId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    filteredUpdates,
    { new: true }
  ).lean();

  if (!workout) {
    return res.status(404).json({
      status: "error",
      message: "Workout not found",
    });
  }

  res.json({
    status: "success",
    data: {
      workout,
    },
  });
});

// DELETE /api/workouts/:id - Delete workout
export const deleteWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const workoutId = req.params.id;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid workout ID format",
    });
  }

  const workout = await Workout.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(workoutId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!workout) {
    return res.status(404).json({
      status: "error",
      message: "Workout not found",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Seed some sample data for testing
export const seedSampleWorkouts = async (userId: string) => {
  try {
    // Check if user already has workouts
    const existingWorkouts = await Workout.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existingWorkouts > 0) {
      console.log(
        `User ${userId} already has ${existingWorkouts} workouts. Skipping seed.`
      );
      return;
    }

    const sampleWorkouts = [
      {
        userId: new mongoose.Types.ObjectId(userId),
        name: "Morning Run in Park",
        sport: "running" as const,
        startTime: new Date("2025-06-27T08:00:00Z"),
        endTime: new Date("2025-06-27T08:30:00Z"),
        coordinates: [
          {
            lat: 45.5017,
            lng: -73.5673,
            timestamp: new Date("2025-06-27T08:00:00Z"),
            elevation: 50,
          },
          {
            lat: 45.5025,
            lng: -73.568,
            timestamp: new Date("2025-06-27T08:05:00Z"),
            elevation: 55,
          },
          {
            lat: 45.5035,
            lng: -73.5675,
            timestamp: new Date("2025-06-27T08:10:00Z"),
            elevation: 52,
          },
          {
            lat: 45.5017,
            lng: -73.5673,
            timestamp: new Date("2025-06-27T08:30:00Z"),
            elevation: 50,
          },
        ],
        stats: {
          distance: 5.2,
          duration: 1800,
          avgPace: "5:45",
          elevationGain: 120,
          elevationLoss: 115,
          calories: 350,
          avgHeartRate: 150,
          maxHeartRate: 175,
          steps: 6800,
        },
        source: "apple_watch" as const,
      },
      {
        userId: new mongoose.Types.ObjectId(userId),
        name: "Cycling Along River",
        sport: "cycling" as const,
        startTime: new Date("2025-06-26T09:00:00Z"),
        endTime: new Date("2025-06-26T09:45:00Z"),
        coordinates: [
          {
            lat: 45.4995,
            lng: -73.57,
            timestamp: new Date("2025-06-26T09:00:00Z"),
            elevation: 40,
          },
          {
            lat: 45.4985,
            lng: -73.572,
            timestamp: new Date("2025-06-26T09:15:00Z"),
            elevation: 42,
          },
          {
            lat: 45.4945,
            lng: -73.58,
            timestamp: new Date("2025-06-26T09:45:00Z"),
            elevation: 38,
          },
        ],
        stats: {
          distance: 15.8,
          duration: 2700,
          avgSpeed: "21.2 km/h",
          maxSpeed: 35.5,
          elevationGain: 85,
          elevationLoss: 92,
          calories: 420,
          avgHeartRate: 140,
          maxHeartRate: 165,
        },
        source: "iphone" as const,
      },
      {
        userId: new mongoose.Types.ObjectId(userId),
        name: "Evening Jog",
        sport: "running" as const,
        startTime: new Date("2025-06-25T19:00:00Z"),
        endTime: new Date("2025-06-25T19:20:00Z"),
        coordinates: [
          {
            lat: 45.502,
            lng: -73.568,
            timestamp: new Date("2025-06-25T19:00:00Z"),
            elevation: 48,
          },
          {
            lat: 45.503,
            lng: -73.5685,
            timestamp: new Date("2025-06-25T19:10:00Z"),
            elevation: 52,
          },
          {
            lat: 45.502,
            lng: -73.568,
            timestamp: new Date("2025-06-25T19:20:00Z"),
            elevation: 48,
          },
        ],
        stats: {
          distance: 3.8,
          duration: 1200,
          avgPace: "5:15",
          elevationGain: 45,
          elevationLoss: 45,
          calories: 280,
          avgHeartRate: 145,
          maxHeartRate: 165,
          steps: 4500,
        },
        source: "apple_watch" as const,
      },
    ];

    // Insert sample workouts
    await Workout.insertMany(sampleWorkouts);
    console.log(
      `Successfully seeded ${sampleWorkouts.length} sample workouts for user ${userId}`
    );
  } catch (error) {
    console.error("Error seeding sample workouts:", error);
    throw error;
  }
};
