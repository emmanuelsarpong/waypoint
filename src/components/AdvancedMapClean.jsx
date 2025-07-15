import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";

// Sample routes data
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
    coordinates: [
      [45.5017, -73.5673],
      [45.5025, -73.568],
      [45.5035, -73.5675],
      [45.5045, -73.569],
      [45.505, -73.5685],
      [45.504, -73.567],
      [45.503, -73.5665],
      [45.5017, -73.5673],
    ],
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
    coordinates: [
      [45.4995, -73.57],
      [45.4985, -73.572],
      [45.4975, -73.574],
      [45.4965, -73.576],
      [45.4955, -73.578],
      [45.4945, -73.58],
    ],
  },
  {
    id: 3,
    name: "Hiking Trail",
    sport: "hiking",
    date: "2025-06-25",
    distance: 8.5,
    duration: 4200,
    avgPace: "8:15",
    elevationGain: 340,
    calories: 520,
    steps: 11200,
    coordinates: [
      [45.51, -73.56],
      [45.512, -73.558],
      [45.514, -73.556],
      [45.516, -73.554],
      [45.518, -73.552],
    ],
  },
];

// Helper functions
const calculateDistance = (coords) => {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lng1] = coords[i - 1];
    const [lat2, lng2] = coords[i];
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total * 10) / 10;
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const getSportColor = (sport) => {
  const colors = {
    running: "#00d4ff",
    cycling: "#00ff94",
    hiking: "#ff6b6b",
    default: "#a78bfa",
  };
  return colors[sport] || colors.default;
};

const cuteMarker = new L.Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'><ellipse cx='16' cy='16' rx='14' ry='14' fill='%238b5cf6' stroke='white' stroke-width='3'/><circle cx='16' cy='16' r='7' fill='white'/></svg>",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const AddRoute = ({ setPath }) => {
  useMapEvents({
    click(e) {
      setPath((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

const AdvancedMapClean = () => {
  const [path, setPath] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRoutesList, setShowRoutesList] = useState(false);
  const [sportFilter, setSportFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load test data
  const seedTestData = async () => {
    setSavedRoutes(SAMPLE_ROUTES);
    setIsLoading(false);

    try {
      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/api/seed-workouts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        // Test data seeded to backend (debug removed for production)
      }
    } catch (error) {
      console.error("Backend seeding failed:", error);
    }
  };

  // Fetch user routes
  const fetchUserRoutes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSavedRoutes([]);
        setIsLoading(false);
        return;
      }

      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/api/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch routes");

      const data = await response.json();
      const transformedRoutes = data.data.workouts.map((workout) => ({
        id: workout.id,
        name: workout.name,
        sport: workout.sport,
        date: workout.createdAt.split("T")[0],
        distance: workout.stats.distance,
        duration: workout.stats.duration,
        avgPace: workout.stats.avgPace,
        avgSpeed: workout.stats.avgSpeed,
        elevationGain: workout.stats.elevationGain,
        calories: workout.stats.calories,
        steps: workout.stats.steps || 0,
        coordinates: workout.coordinates.map((coord) => [coord.lat, coord.lng]),
      }));

      setSavedRoutes(transformedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setSavedRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoutes();
  }, []);

  const filteredRoutes = savedRoutes.filter(
    (route) => sportFilter === "all" || route.sport === sportFilter
  );

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    setPath([]);
    // Auto-close sidebar on mobile when route is selected
    if (isMobile && showRoutesList) {
      setShowRoutesList(false);
    }
  };

  const saveCurrentRoute = async () => {
    if (path.length < 2) {
      alert("Please create a route with at least 2 points");
      return;
    }

    const newRoute = {
      name: `New Route ${savedRoutes.length + 1}`,
      sport: "running",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      coordinates: path.map((coord, index) => ({
        lat: coord[0],
        lng: coord[1],
        timestamp: new Date(Date.now() + index * 1000).toISOString(),
        elevation: 50,
      })),
      stats: {
        distance: calculateDistance(path),
        duration: 0,
        avgPace: "0:00",
        elevationGain: 0,
        elevationLoss: 0,
        calories: 0,
        steps: 0,
      },
      source: "web_app",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to save routes");
        return;
      }

      const backendUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/api/workouts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      });

      if (!response.ok) throw new Error("Failed to save route");

      const data = await response.json();
      const savedWorkout = data.data.workout;

      const transformedRoute = {
        id: savedWorkout.id,
        name: savedWorkout.name,
        sport: savedWorkout.sport,
        date: savedWorkout.createdAt.split("T")[0],
        distance: savedWorkout.stats.distance,
        duration: savedWorkout.stats.duration,
        avgPace: savedWorkout.stats.avgPace,
        avgSpeed: savedWorkout.stats.avgSpeed,
        elevationGain: savedWorkout.stats.elevationGain,
        calories: savedWorkout.stats.calories,
        steps: savedWorkout.stats.steps || 0,
        coordinates: savedWorkout.coordinates.map((coord) => [
          coord.lat,
          coord.lng,
        ]),
      };

      setSavedRoutes((prev) => [transformedRoute, ...prev]);
      setSelectedRoute(transformedRoute);
      setPath([]);
      alert(`Route saved: ${transformedRoute.distance}km`);
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Failed to save route. Please try again.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 140px)", // Account for topbar and padding
        background: "#000000",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "0",
        margin: "0",
        position: "relative",
        minHeight: "400px", // Ensure minimum height on mobile
      }}
    >
      {/* Dark Header - OpenAI Style */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "20px",
          paddingBottom: "24px",
          background: "#000000",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#ffffff",
            margin: "0 0 8px 0",
            letterSpacing: "-1px",
          }}
        >
          Waypoint
        </h1>
        <p
          style={{
            color: "#a0a0a0",
            fontSize: "1.1rem",
            margin: 0,
            fontWeight: "400",
          }}
        >
          Modern route tracking and analysis
        </p>
      </div>

      {/* Main Container - Dark Theme */}
      <div
        style={{
          width: "100%",
          height: "calc(100% - 120px)", // Account for header
          background: "#1a1a1a",
          borderRadius: "16px",
          border: "1px solid #333333",
          overflow: "hidden",
          position: "relative",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Routes List Sidebar - Fixed widget */}
        {showRoutesList && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "80px" : "24px",
              left: isMobile ? "12px" : "80px",
              width: isMobile ? "280px" : "300px",
              maxHeight: isMobile ? "300px" : "400px",
              background: "rgba(20, 20, 22, 0.98)",
              backdropFilter: "blur(20px)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.05)",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            {/* Compact Header */}
            <div
              style={{
                padding: "16px 20px",
                background: "transparent",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#ffffff",
                  }}
                >
                  My Routes
                </h3>
              </div>
              <button
                onClick={() => setShowRoutesList(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "6px",
                  width: "28px",
                  height: "28px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(239, 68, 68, 0.8)";
                  e.target.style.border = "1px solid rgba(239, 68, 68, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                }}
              >
                ✕
              </button>
            </div>

            {/* Compact Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "8px",
                fontSize: "0.8rem",
                padding: "12px 16px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "#ffffff",
                  }}
                >
                  {savedRoutes.length}
                </div>
                <div
                  style={{
                    opacity: 0.6,
                    color: "#a0a0a0",
                    fontSize: "0.75rem",
                  }}
                >
                  Routes
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "#ffffff",
                  }}
                >
                  {savedRoutes
                    .reduce((sum, route) => sum + route.distance, 0)
                    .toFixed(1)}
                  km
                </div>
                <div
                  style={{
                    opacity: 0.6,
                    color: "#a0a0a0",
                    fontSize: "0.75rem",
                  }}
                >
                  Total
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "#ffffff",
                  }}
                >
                  {Math.round(
                    savedRoutes.reduce((sum, route) => sum + route.calories, 0)
                  )}
                </div>
                <div
                  style={{
                    opacity: 0.6,
                    color: "#a0a0a0",
                    fontSize: "0.75rem",
                  }}
                >
                  Calories
                </div>
              </div>
            </div>

            {/* Compact Content Area */}
            <div
              style={{
                padding: "12px 16px",
                maxHeight: "200px",
                overflowY: "auto",
                background: "transparent",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#a0a0a0",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "3px solid #404040",
                      borderTop: "3px solid #3b82f6",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 16px",
                    }}
                  />
                  Loading routes...
                </div>
              ) : filteredRoutes.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#a0a0a0",
                    background: "rgba(255, 255, 255, 0.06)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    border: "2px dashed rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    🗺️
                  </div>
                  <div
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#ffffff",
                    }}
                  >
                    No routes yet
                  </div>
                  <div style={{ color: "#a0a0a0" }}>
                    Create your first route!
                  </div>
                </div>
              ) : (
                filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    onClick={() => handleRouteClick(route)}
                    style={{
                      padding: "12px",
                      marginBottom: "8px",
                      border:
                        selectedRoute?.id === route.id
                          ? `2px solid ${getSportColor(route.sport)}`
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      background:
                        selectedRoute?.id === route.id
                          ? `linear-gradient(135deg, ${getSportColor(
                              route.sport
                            )}30, ${getSportColor(route.sport)}10)`
                          : "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s",
                      transform:
                        selectedRoute?.id === route.id
                          ? "translateY(-2px)"
                          : "translateY(0)",
                      boxShadow:
                        selectedRoute?.id === route.id
                          ? `0 12px 32px ${getSportColor(
                              route.sport
                            )}40, 0 0 0 0.5px rgba(255, 255, 255, 0.1)`
                          : "0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRoute?.id !== route.id) {
                        e.target.style.transform = "translateY(-1px)";
                        e.target.style.background = "rgba(255, 255, 255, 0.12)";
                        e.target.style.boxShadow =
                          "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.1)";
                        e.target.style.border =
                          "1px solid rgba(255, 255, 255, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRoute?.id !== route.id) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.background = "rgba(255, 255, 255, 0.08)";
                        e.target.style.boxShadow =
                          "0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05)";
                        e.target.style.border =
                          "1px solid rgba(255, 255, 255, 0.1)";
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#ffffff",
                          flex: 1,
                          marginRight: "12px",
                        }}
                      >
                        {route.name}
                      </h4>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor: getSportColor(route.sport),
                          color: "white",
                          textTransform: "uppercase",
                        }}
                      >
                        {route.sport}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#a0a0a0",
                        marginBottom: "12px",
                      }}
                    >
                      📅 {new Date(route.date).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        fontSize: "0.875rem",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>
                          {route.distance}km
                        </div>
                        <div style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>
                          Distance
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          background: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "10px",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>
                          {formatDuration(route.duration)}
                        </div>
                        <div style={{ color: "#a0a0a0", fontSize: "0.75rem" }}>
                          Duration
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "#a0a0a0",
                      }}
                    >
                      <span>🔥 {route.calories} cal</span>
                      <span>↗ {route.elevationGain}m</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Responsive Controls Bar */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? "12px" : "24px",
            left: isMobile
              ? "12px"
              : showRoutesList
              ? `${(isMobile ? 280 : 300) + 96}px`
              : "24px",
            right: isMobile ? "12px" : "24px",
            zIndex: 1002,
            transition: "all 0.3s",
          }}
        >
          <div
            style={{
              background: "rgba(20, 20, 22, 0.98)",
              backdropFilter: "blur(20px)",
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "12px 16px" : "16px 20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.05)",
              display: "flex",
              gap: isMobile ? "8px" : "12px",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              style={{
                padding: isMobile ? "8px 12px" : "10px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: isMobile ? "0.8rem" : "0.875rem",
                fontWeight: "500",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s",
                minWidth: isMobile ? "auto" : "140px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
              }}
            >
              <option value="all">🏃‍♂️ All Sports</option>
              <option value="running">🏃‍♂️ Running</option>
              <option value="cycling">🚴‍♂️ Cycling</option>
              <option value="hiking">🥾 Hiking</option>
            </select>

            <button
              onClick={() => setShowRoutesList(!showRoutesList)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: showRoutesList
                  ? "rgba(59, 130, 246, 0.9)"
                  : "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: "white",
                border: showRoutesList
                  ? "1px solid rgba(59, 130, 246, 0.3)"
                  : "1px solid rgba(255, 255, 255, 0.2)",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: showRoutesList
                  ? "0 4px 12px rgba(59, 130, 246, 0.4)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (showRoutesList) {
                  e.target.style.background = "rgba(59, 130, 246, 1)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(59, 130, 246, 0.5)";
                } else {
                  e.target.style.background = "rgba(255, 255, 255, 0.15)";
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (showRoutesList) {
                  e.target.style.background = "rgba(59, 130, 246, 0.9)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(59, 130, 246, 0.4)";
                } else {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                }
              }}
            >
              📂 Routes ({savedRoutes.length})
            </button>

            <button
              onClick={saveCurrentRoute}
              disabled={path.length < 2}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background:
                  path.length < 2
                    ? "rgba(128, 128, 128, 0.3)"
                    : "rgba(16, 185, 129, 0.9)",
                backdropFilter: "blur(10px)",
                color: path.length < 2 ? "#666666" : "white",
                border:
                  path.length < 2
                    ? "1px solid rgba(128, 128, 128, 0.2)"
                    : "1px solid rgba(16, 185, 129, 0.3)",
                fontWeight: "600",
                fontSize: "0.875rem",
                cursor: path.length < 2 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow:
                  path.length >= 2
                    ? "0 4px 12px rgba(16, 185, 129, 0.4)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (path.length >= 2) {
                  e.target.style.background = "rgba(16, 185, 129, 1)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(16, 185, 129, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (path.length >= 2) {
                  e.target.style.background = "rgba(16, 185, 129, 0.9)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.4)";
                }
              }}
            >
              💾 Save Route
            </button>

            {savedRoutes.length === 0 && !isLoading && (
              <button
                onClick={seedTestData}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: "rgba(139, 92, 246, 0.9)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(139, 92, 246, 1)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(139, 92, 246, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(139, 92, 246, 0.9)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(139, 92, 246, 0.4)";
                }}
              >
                🎯 Load Test Data
              </button>
            )}

            {selectedRoute && (
              <button
                onClick={() => {
                  setSelectedRoute(null);
                  setPath([]);
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(239, 68, 68, 0.8)";
                  e.target.style.border = "1px solid rgba(239, 68, 68, 0.3)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(239, 68, 68, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
                  e.target.style.boxShadow = "none";
                }}
              >
                ✖️ Clear
              </button>
            )}
          </div>
        </div>

        {/* Map Container */}
        <div
          style={{
            height: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          <MapContainer
            center={[45.5017, -73.5673]}
            zoom={14}
            scrollWheelZoom
            style={{ width: "100%", height: "100%", zIndex: 1 }}
            className="map-container-below-sidebar"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution="© CartoDB"
            />

            {/* Allow creating new routes only when no route is selected */}
            {!selectedRoute && <AddRoute setPath={setPath} />}

            {/* Show current path being created */}
            {!selectedRoute &&
              path.map((position, idx) => (
                <Marker key={idx} position={position} icon={cuteMarker}>
                  <Popup>
                    <span style={{ color: "#8b5cf6", fontWeight: 600 }}>
                      Point {idx + 1}
                    </span>
                  </Popup>
                </Marker>
              ))}
            {!selectedRoute && path.length > 1 && (
              <Polyline
                positions={path}
                color="#00d4ff"
                weight={2}
                opacity={0.9}
              />
            )}

            {/* Show all saved routes on map */}
            {filteredRoutes.map((route) => (
              <Polyline
                key={route.id}
                positions={route.coordinates}
                color={getSportColor(route.sport)}
                weight={selectedRoute?.id === route.id ? 3 : 2}
                opacity={selectedRoute?.id === route.id ? 1 : 0.8}
                dashArray={selectedRoute?.id === route.id ? null : "3, 3"}
                eventHandlers={{
                  click: () => handleRouteClick(route),
                }}
              />
            ))}

            {/* Start/End markers for selected route */}
            {selectedRoute && selectedRoute.coordinates.length > 0 && (
              <>
                <Marker
                  position={selectedRoute.coordinates[0]}
                  icon={
                    new L.Icon({
                      iconUrl:
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='12' fill='%2322c55e' stroke='white' stroke-width='3'/><circle cx='14' cy='14' r='6' fill='white'/><text x='14' y='18' text-anchor='middle' fill='%2322c55e' font-size='10' font-weight='bold'>S</text></svg>",
                      iconSize: [28, 28],
                      iconAnchor: [14, 14],
                    })
                  }
                >
                  <Popup>
                    <div style={{ textAlign: "center", fontWeight: "600" }}>
                      🚀 <strong>Start</strong>
                      <br />
                      <small>{selectedRoute.name}</small>
                    </div>
                  </Popup>
                </Marker>
                <Marker
                  position={
                    selectedRoute.coordinates[
                      selectedRoute.coordinates.length - 1
                    ]
                  }
                  icon={
                    new L.Icon({
                      iconUrl:
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'><circle cx='14' cy='14' r='12' fill='%23ef4444' stroke='white' stroke-width='3'/><circle cx='14' cy='14' r='6' fill='white'/><text x='14' y='18' text-anchor='middle' fill='%23ef4444' font-size='10' font-weight='bold'>F</text></svg>",
                      iconSize: [28, 28],
                      iconAnchor: [14, 14],
                    })
                  }
                >
                  <Popup>
                    <div style={{ textAlign: "center", fontWeight: "600" }}>
                      🏁 <strong>Finish</strong>
                      <br />
                      <small>Distance: {selectedRoute.distance}km</small>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        {/* macOS Style Route Stats Overlay */}
        {selectedRoute && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "380px" : "80px",
              left: isMobile ? "12px" : window.innerWidth - 360 + "px",
              background: "rgba(20, 20, 22, 0.98)",
              backdropFilter: "blur(20px)",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 0.5px rgba(255, 255, 255, 0.05)",
              zIndex: 1003,
              minWidth: "280px",
              maxWidth: "320px",
              pointerEvents: "auto",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginRight: "12px",
                    }}
                  >
                    {selectedRoute.name}
                  </h3>
                </div>
                <span
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    backgroundColor: getSportColor(selectedRoute.sport),
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  {selectedRoute.sport}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#a0a0a0",
                  fontWeight: "500",
                }}
              >
                📅{" "}
                {new Date(selectedRoute.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* macOS Stats Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#3b82f6",
                    marginBottom: "4px",
                  }}
                >
                  {selectedRoute.distance}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#a0a0a0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Kilometers
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#f59e0b",
                    marginBottom: "4px",
                  }}
                >
                  {formatDuration(selectedRoute.duration)}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#a0a0a0",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Duration
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: "#10b981",
                    marginBottom: "4px",
                  }}
                >
                  {selectedRoute.avgPace || selectedRoute.avgSpeed}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#16a34a",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Avg Pace
                </div>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
                  backdropFilter: "blur(10px)",
                  padding: "16px",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  boxShadow: "0 4px 16px rgba(124, 58, 237, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "800",
                    color: "#7c3aed",
                    marginBottom: "4px",
                  }}
                >
                  ↗ {selectedRoute.elevationGain}m
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#7c3aed",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Elevation
                </div>
              </div>
            </div>

            {/* macOS Additional Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "700",
                    color: "#ef4444",
                    marginBottom: "4px",
                  }}
                >
                  🔥 {selectedRoute.calories}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#a0a0a0",
                    fontWeight: "600",
                  }}
                >
                  Calories
                </div>
              </div>
              {selectedRoute.steps > 0 && (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "700",
                      color: "#3b82f6",
                      marginBottom: "4px",
                    }}
                  >
                    👟 {selectedRoute.steps.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "600",
                    }}
                  >
                    Steps
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS for animations and mobile responsiveness */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes slideInLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          /* Smooth scrollbar for sidebar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          
          /* Mobile responsive adjustments */
          @media (max-width: 768px) {
            .leaflet-control-container .leaflet-top.leaflet-right {
              top: 60px !important;
              right: 12px !important;
            }
            
            .leaflet-control-container .leaflet-bottom.leaflet-left {
              bottom: 240px !important;
              left: 12px !important;
            }
            
            .leaflet-popup-content-wrapper {
              font-size: 12px !important;
            }
            
            .leaflet-control-zoom {
              border-radius: 8px !important;
              overflow: hidden;
            }
            
            .leaflet-control-zoom a {
              width: 36px !important;
              height: 36px !important;
              line-height: 36px !important;
              font-size: 16px !important;
            }
          }
          
          @media (max-width: 480px) {
            .leaflet-control-container .leaflet-top.leaflet-right {
              top: 60px !important;
              right: 8px !important;
            }
            
            .leaflet-control-container .leaflet-bottom.leaflet-left {
              bottom: 220px !important;
              left: 8px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdvancedMapClean;
