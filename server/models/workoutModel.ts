import mongoose, { Document, Schema } from "mongoose";

export interface IWorkout extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  sport: "running" | "cycling" | "hiking" | "walking";
  startTime: Date;
  endTime: Date;
  coordinates: Array<{
    lat: number;
    lng: number;
    timestamp: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const coordinateSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  elevation: { type: Number },
  speed: { type: Number },
  heartRate: { type: Number },
});

const statsSchema = new Schema({
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  avgPace: { type: String },
  avgSpeed: { type: String },
  maxSpeed: { type: Number },
  elevationGain: { type: Number, required: true },
  elevationLoss: { type: Number, required: true },
  calories: { type: Number, required: true },
  avgHeartRate: { type: Number },
  maxHeartRate: { type: Number },
  steps: { type: Number },
});

const workoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    sport: {
      type: String,
      enum: ["running", "cycling", "hiking", "walking"],
      required: true,
      index: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    coordinates: [coordinateSchema],
    stats: { type: statsSchema, required: true },
    source: {
      type: String,
      enum: ["apple_watch", "iphone", "web_app"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
workoutSchema.index({ userId: 1, createdAt: -1 });
workoutSchema.index({ userId: 1, sport: 1 });
workoutSchema.index({ "stats.distance": -1 });
workoutSchema.index({ "stats.duration": -1 });

export default mongoose.model<IWorkout>("Workout", workoutSchema);
