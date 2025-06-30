/**
 * Test script to demonstrate Apple Watch integration workflow
 * This simulates what an Apple Watch app would send to your backend
 */

// Sample workout data that an Apple Watch app would generate
const sampleAppleWatchWorkout = {
  name: "Apple Watch Morning Run",
  sport: "running",
  startTime: "2025-06-28T08:00:00Z",
  endTime: "2025-06-28T08:25:00Z",
  coordinates: [
    {
      lat: 45.5017,
      lng: -73.5673,
      timestamp: "2025-06-28T08:00:00Z",
      elevation: 50,
      heartRate: 120,
    },
    {
      lat: 45.5025,
      lng: -73.568,
      timestamp: "2025-06-28T08:02:30Z",
      elevation: 55,
      heartRate: 135,
    },
    {
      lat: 45.5035,
      lng: -73.5675,
      timestamp: "2025-06-28T08:05:00Z",
      elevation: 52,
      heartRate: 150,
    },
    {
      lat: 45.5045,
      lng: -73.569,
      timestamp: "2025-06-28T08:07:30Z",
      elevation: 58,
      heartRate: 155,
    },
    {
      lat: 45.505,
      lng: -73.5685,
      timestamp: "2025-06-28T08:10:00Z",
      elevation: 60,
      heartRate: 160,
    },
    {
      lat: 45.504,
      lng: -73.567,
      timestamp: "2025-06-28T08:15:00Z",
      elevation: 55,
      heartRate: 145,
    },
    {
      lat: 45.503,
      lng: -73.5665,
      timestamp: "2025-06-28T08:20:00Z",
      elevation: 50,
      heartRate: 140,
    },
    {
      lat: 45.5017,
      lng: -73.5673,
      timestamp: "2025-06-28T08:25:00Z",
      elevation: 50,
      heartRate: 125,
    },
  ],
  stats: {
    distance: 2.8, // km (calculated from GPS)
    duration: 1500, // seconds (25 minutes)
    avgPace: "8:55", // min/km
    maxSpeed: 15.2, // km/h
    elevationGain: 15, // meters
    elevationLoss: 10,
    calories: 280, // calculated from heart rate + user profile
    avgHeartRate: 142,
    maxHeartRate: 160,
    steps: 3200, // from accelerometer
  },
  source: "apple_watch",
};

console.log("📱 Sample Apple Watch Workout Data:");
console.log("=====================================");
console.log(JSON.stringify(sampleAppleWatchWorkout, null, 2));

console.log("\n🔄 Workflow:");
console.log("1. Apple Watch records GPS coordinates during workout");
console.log("2. Watch calculates real-time stats (pace, heart rate, etc.)");
console.log("3. When workout ends, data is sent to iPhone");
console.log("4. iPhone uploads workout to your backend API:");
console.log("   POST http://localhost:3000/api/workouts");
console.log("5. Your web app automatically displays the new route!");

console.log("\n✅ Your backend is ready for this workflow!");
console.log("Next step: Build the Apple Watch app that generates this data.");
