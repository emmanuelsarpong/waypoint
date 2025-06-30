import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

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

// In-memory storage for now (replace with MongoDB later)
let workouts: Array<
  WorkoutData & { id: string; userId: string; createdAt: string }
> = [];

// POST /api/workouts - Create new workout
export const createWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
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

  // Create new workout
  const newWorkout = {
    id: Date.now().toString(),
    userId,
    createdAt: new Date().toISOString(),
    ...workoutData,
  };

  workouts.push(newWorkout);

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
    const userId = req.user.id;
    const { sport, page = 1, limit = 20, sortBy = "createdAt" } = req.query;

    // Filter user's workouts
    let userWorkouts = workouts.filter((w) => w.userId === userId);

    // Filter by sport if specified
    if (sport && sport !== "all") {
      userWorkouts = userWorkouts.filter((w) => w.sport === sport);
    }

    // Sort workouts (newest first by default)
    userWorkouts.sort((a, b) => {
      if (sortBy === "distance") {
        return b.stats.distance - a.stats.distance;
      }
      if (sortBy === "duration") {
        return b.stats.duration - a.stats.duration;
      }
      // Default: sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedWorkouts = userWorkouts.slice(startIndex, endIndex);

    res.json({
      status: "success",
      results: paginatedWorkouts.length,
      totalWorkouts: userWorkouts.length,
      page: Number(page),
      totalPages: Math.ceil(userWorkouts.length / Number(limit)),
      data: {
        workouts: paginatedWorkouts,
      },
    });
  }
);

// GET /api/workouts/stats - Get user's workout statistics
export const getWorkoutStats = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const userWorkouts = workouts.filter((w) => w.userId === userId);

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
      },
    });
  }
);

// GET /api/workouts/:id - Get specific workout
export const getWorkoutById = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const workoutId = req.params.id;

    const workout = workouts.find(
      (w) => w.id === workoutId && w.userId === userId
    );

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
  const userId = req.user.id;
  const workoutId = req.params.id;
  const updates = req.body;

  const workoutIndex = workouts.findIndex(
    (w) => w.id === workoutId && w.userId === userId
  );

  if (workoutIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Workout not found",
    });
  }

  // Update allowed fields (name, sport, notes, etc.)
  const allowedUpdates = ["name", "sport"];
  const filteredUpdates: any = {};

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  });

  workouts[workoutIndex] = { ...workouts[workoutIndex], ...filteredUpdates };

  res.json({
    status: "success",
    data: {
      workout: workouts[workoutIndex],
    },
  });
});

// DELETE /api/workouts/:id - Delete workout
export const deleteWorkout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const workoutId = req.params.id;

  const workoutIndex = workouts.findIndex(
    (w) => w.id === workoutId && w.userId === userId
  );

  if (workoutIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Workout not found",
    });
  }

  workouts.splice(workoutIndex, 1);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Seed some sample data for testing
export const seedSampleWorkouts = (userId: string) => {
  const sampleWorkouts = [
    {
      id: "sample_1",
      userId,
      name: "Morning Run in Park",
      sport: "running" as const,
      startTime: "2025-06-27T08:00:00Z",
      endTime: "2025-06-27T08:30:00Z",
      coordinates: [
        {
          lat: 45.5017,
          lng: -73.5673,
          timestamp: "2025-06-27T08:00:00Z",
          elevation: 50,
        },
        {
          lat: 45.5025,
          lng: -73.568,
          timestamp: "2025-06-27T08:05:00Z",
          elevation: 55,
        },
        {
          lat: 45.5035,
          lng: -73.5675,
          timestamp: "2025-06-27T08:10:00Z",
          elevation: 52,
        },
        {
          lat: 45.5017,
          lng: -73.5673,
          timestamp: "2025-06-27T08:30:00Z",
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
      createdAt: "2025-06-27T08:30:00Z",
    },
    {
      id: "sample_2",
      userId,
      name: "Cycling Along River",
      sport: "cycling" as const,
      startTime: "2025-06-26T09:00:00Z",
      endTime: "2025-06-26T09:45:00Z",
      coordinates: [
        {
          lat: 45.4995,
          lng: -73.57,
          timestamp: "2025-06-26T09:00:00Z",
          elevation: 40,
        },
        {
          lat: 45.4985,
          lng: -73.572,
          timestamp: "2025-06-26T09:15:00Z",
          elevation: 42,
        },
        {
          lat: 45.4945,
          lng: -73.58,
          timestamp: "2025-06-26T09:45:00Z",
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
      createdAt: "2025-06-26T09:45:00Z",
    },
  ];

  // Add sample workouts if they don't exist
  sampleWorkouts.forEach((workout) => {
    if (!workouts.find((w) => w.id === workout.id)) {
      workouts.push(workout);
    }
  });
};
