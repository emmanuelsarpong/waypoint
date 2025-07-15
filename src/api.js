// Mock API functions for user statistics
// In a real app, these would make actual HTTP requests to your backend

const SAMPLE_ROUTES = [
  {
    id: 1,
    name: "Morning Run in Park",
    sport: "running",
    date: "2025-06-27",
    distance: 5.2,
    duration: 1800,
    avgPace: "5:45",
    elevationGain: 120,
    calories: 350,
    steps: 6800,
  },
  {
    id: 2,
    name: "Cycling Along River",
    sport: "cycling",
    date: "2025-06-26",
    distance: 15.8,
    duration: 2700,
    avgSpeed: "21.2 km/h",
    elevationGain: 85,
    calories: 420,
    steps: 0,
  },
  {
    id: 3,
    name: "Evening Jog",
    sport: "running",
    date: "2025-06-25",
    distance: 3.8,
    duration: 1200,
    avgPace: "5:15",
    elevationGain: 45,
    calories: 280,
    steps: 4500,
  },
];

const SAMPLE_FRIEND_ACTIVITIES = [
  {
    user: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    },
    distance: 8.2,
    sport: "running",
    date: "2025-07-01",
  },
  {
    user: {
      name: "Mike Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80",
    },
    distance: 12.5,
    sport: "cycling",
    date: "2025-07-01",
  },
];

export const fetchUserStats = async (_userId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Calculate totals from sample routes
  const totalDistance = SAMPLE_ROUTES.reduce(
    (sum, route) => sum + route.distance,
    0
  );
  const totalCalories = SAMPLE_ROUTES.reduce(
    (sum, route) => sum + route.calories,
    0
  );
  const totalRoutes = SAMPLE_ROUTES.length;

  // Generate weekly data based on recent routes
  const weeklyData = [
    { name: "Mon", value: 2.3 },
    { name: "Tue", value: 3.1 },
    { name: "Wed", value: 4.0 },
    { name: "Thu", value: 3.7 },
    { name: "Fri", value: 5.2 },
    { name: "Sat", value: 6.1 },
    { name: "Sun", value: 4.9 },
  ];

  return {
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalRoutes,
    totalCalories,
    weeklyData,
    recentRoutes: SAMPLE_ROUTES.slice(-3), // Last 3 routes
    friendActivities: SAMPLE_FRIEND_ACTIVITIES,
  };
};

// Additional API functions for future use
export const saveRoute = async (_routeData) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { success: true, id: Date.now() };
};

export const getUserProfile = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: userId,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/64/fb2576/ffffff?text=JD",
  };
};
