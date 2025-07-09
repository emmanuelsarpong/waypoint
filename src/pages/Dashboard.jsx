import React, { useState, useEffect } from "react";
import StatWidget from "../components/StatWidget";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { fetchUserStats } from "../api";

const weeklyData = [
  { name: "Mon", value: 2.3 },
  { name: "Tue", value: 3.1 },
  { name: "Wed", value: 4.0 },
  { name: "Thu", value: 3.7 },
  { name: "Fri", value: 5.2 },
  { name: "Sat", value: 6.1 },
  { name: "Sun", value: 4.9 },
];

const monthlyData = [
  { name: "Jan", value: 0.8 },
  { name: "Feb", value: 1.2 },
  { name: "Mar", value: 2.4 },
  { name: "Apr", value: 3.1 },
  { name: "May", value: 3.8 },
  { name: "Jun", value: 4.5 },
  { name: "Jul", value: 4.9 },
  { name: "Aug", value: 5.1 },
  { name: "Sep", value: 5.4 },
  { name: "Oct", value: 6.2 },
  { name: "Nov", value: 6.6 },
  { name: "Dec", value: 7.0 },
];

const yearlyData = [
  { name: "2020", value: 30 },
  { name: "2021", value: 45 },
  { name: "2022", value: 52 },
  { name: "2023", value: 60 },
  { name: "2024", value: 71 },
];

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [range, setRange] = useState("monthly");
  const [userStats, setUserStats] = useState({
    totalDistance: 0,
    totalRoutes: 0,
    totalCalories: 0,
    weeklyData: [],
  });
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [friendActivities, setFriendActivities] = useState([]);

  useEffect(() => {
    // Fetch user's actual route data
    if (user?.id) {
      fetchUserStats(user.id)
        .then((data) => {
          console.log("Fetched user stats:", data); // Debug log
          setUserStats(data);
          setRecentRoutes(data.recentRoutes || []);
          setFriendActivities(data.friendActivities || []);
        })
        .catch((error) => {
          console.error("Error fetching user stats:", error);
          // Set default data with the weekly data as fallback
          setUserStats({
            totalDistance: 0,
            totalRoutes: 0,
            totalCalories: 0,
            weeklyData: weeklyData, // Use the mock weeklyData as fallback
          });
          setRecentRoutes([]);
          setFriendActivities([]);
        });
    } else {
      // If no user ID, use default data
      setUserStats({
        totalDistance: 0,
        totalRoutes: 0,
        totalCalories: 0,
        weeklyData: weeklyData,
      });
    }
  }, [user]);

  const getChartData = () => {
    if (range === "weekly") {
      // Use actual user data if available, otherwise fall back to mock data
      return userStats.weeklyData && userStats.weeklyData.length > 0
        ? userStats.weeklyData
        : weeklyData;
    }
    if (range === "yearly") return yearlyData;
    return monthlyData;
  };

  const statWidgets = [
    {
      title: "Move",
      value: userStats.totalCalories.toLocaleString(),
      unit: "CAL",
      color: "#fb2576",
      path: "/move",
    },
    {
      title: "Exercise",
      value: userStats.totalRoutes.toLocaleString(),
      unit: "MIN",
      color: "#caff70",
      path: "/exercise",
    },
    {
      title: "Stand",
      value: "10",
      unit: "HRS",
      color: "#00f0ff",
      path: "/stand",
    },
    {
      title: "Step Count",
      value: "6,829",
      unit: "",
      color: "#ff5c8a",
      path: "/steps",
    },
    {
      title: "Step Distance",
      value: "4.84",
      unit: "KM",
      color: "#40c4ff",
      path: "/distance",
    },
    {
      title: "Sessions",
      value: "1.11",
      unit: "KM",
      color: "#76ff03",
      path: "/sessions",
      extra: <div className="text-xs text-neutral-400 mt-2">Outdoor Walk</div>,
    },
  ];

  const goalWidgets = [
    {
      title: "Weekly Distance Goal",
      current: 15.2,
      target: 25.0,
      unit: "KM",
      progress: 60.8,
    },
    {
      title: "Monthly Runs",
      current: 8,
      target: 12,
      unit: "RUNS",
      progress: 66.7,
    },
  ];

  const achievements = [
    {
      name: "First Steps",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L13.09 8.26L19 7L17.74 13.74L23 14.5L16.74 16.91L18 23L12 18.5L6 23L7.26 16.91L1 14.5L6.26 13.74L5 7L10.91 8.26L12 2Z"
            fill="#caff70"
          />
          <path
            d="M12 6L12.5 9.5L16 9L15.5 12.5L18 13L15.5 15.5L16 19L12 16.5L8 19L8.5 15.5L6 13L8.5 12.5L8 9L11.5 9.5L12 6Z"
            fill="#1a1a1a"
          />
          <circle cx="12" cy="12" r="2" fill="#caff70" />
        </svg>
      ),
    },
    {
      name: "10km Club",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" fill="#ffd700" />
          <circle cx="12" cy="12" r="8" fill="#ffed4e" />
          <circle cx="12" cy="12" r="6" fill="#ffd700" />
          <path d="M9 12h2v-2h2v2h2v2h-2v2h-2v-2H9v-2z" fill="white" />
          <path
            d="M12 4v2M12 18v2M4 12h2M18 12h2"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      name: "Marathon Master",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L15.5 8.5L22 9.5L17 14.5L18.5 21L12 17.5L5.5 21L7 14.5L2 9.5L8.5 8.5L12 2Z"
            fill="#ff6b35"
          />
          <path
            d="M12 5L14.5 10L19 10.5L15.5 14L16.5 18.5L12 16L7.5 18.5L8.5 14L5 10.5L9.5 10L12 5Z"
            fill="#ff8c69"
          />
          <circle cx="12" cy="11" r="3" fill="white" />
          <path d="M11 10h2v2h-2z" fill="#ff6b35" />
          <rect x="10" y="16" width="4" height="2" rx="1" fill="#ff6b35" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 pb-32">
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 tracking-tight">
          {user?.firstName ? `Welcome, ${user.firstName}!` : "Your Dashboard"}
        </h1>

        {/* Responsive Card Grid */}
        <div
          className="dashboard-widget-grid"
          style={{
            margin: "0 auto 40px auto",
            width: "100%",
            maxWidth: "1080px",
          }}
        >
          {statWidgets.map(({ title, value, unit, color, path, extra }) => (
            <StatWidget
              key={title}
              title={title}
              value={value}
              unit={unit}
              data={weeklyData}
              color={color}
              onClick={() => navigate(path)}
            >
              {extra}
            </StatWidget>
          ))}
        </div>

        {/* Chart Section */}
        <div className="w-full px-4">
          <div
            className="w-full mx-auto"
            style={{
              maxWidth: "1080px",
              background: "linear-gradient(to bottom right, #111, #1a1a1a)",
              border: "1px solid #2a2a2a",
              borderRadius: "16px",
              padding: "32px 24px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-2 bg-[#0e0e0e] p-1 rounded-lg">
                {["weekly", "monthly", "yearly"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`profile-toggle-btn px-5 py-2 text-sm sm:text-base font-medium rounded-md transition-all duration-200
                      ${range === r ? "active" : ""}
                    `}
                    type="button"
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-4">
              {range.charAt(0).toUpperCase() + range.slice(1)} Progress
            </h2>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getChartData()}
                  margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#fff"
                    tick={{ fill: "#fff", fontSize: 12 }}
                  />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f472b6"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activities Component */}
        <div className="w-full px-4" style={{ marginTop: "120px" }}>
          <div
            className="recent-activities w-full mx-auto"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Recent Activities</h3>
            {recentRoutes.length > 0 ? (
              recentRoutes.map((route, index) => {
                const getSportIcon = (sport) => {
                  const icons = {
                    running: (
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Running shoe with motion lines */}
                        <path
                          d="M4 18h14c1.1 0 2-.9 2-2v-2c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4z"
                          fill="white"
                        />
                        <path
                          d="M6 13h10c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1z"
                          fill="white"
                        />
                        <path
                          d="M8 11V9c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        {/* Motion lines */}
                        <path
                          d="M2 8h3M2 10h2M2 12h4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        {/* Sole grip pattern */}
                        <circle cx="7" cy="16" r="0.5" fill="#333" />
                        <circle cx="10" cy="16" r="0.5" fill="#333" />
                        <circle cx="13" cy="16" r="0.5" fill="#333" />
                      </svg>
                    ),
                    cycling: (
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Detailed bicycle */}
                        <circle
                          cx="6"
                          cy="18"
                          r="3"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="3"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                        {/* Frame */}
                        <path
                          d="M6 18L12 6L18 18"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M12 6L15 12L18 18"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path d="M9 12h6" stroke="white" strokeWidth="2" />
                        {/* Handlebars */}
                        <path
                          d="M10 6h4"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Pedals */}
                        <circle cx="12" cy="15" r="1" fill="white" />
                        {/* Seat */}
                        <path
                          d="M11 5h2"
                          stroke="white"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    ),
                    hiking: (
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Hiking boot */}
                        <path
                          d="M4 20h12c1.1 0 2-.9 2-2v-1c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v3z"
                          fill="white"
                        />
                        <path
                          d="M6 16h8c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v3z"
                          fill="white"
                        />
                        {/* Boot shaft */}
                        <path
                          d="M8 12V8c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v4"
                          fill="none"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        {/* Laces */}
                        <path
                          d="M9 8L11 10L13 8M9 10L11 12L13 10"
                          stroke="#333"
                          strokeWidth="1"
                        />
                        {/* Mountain silhouette */}
                        <path
                          d="M2 6l3-3 2 2 3-3 2 2 3-2v4H2V6z"
                          fill="white"
                          opacity="0.7"
                        />
                        {/* Hiking stick */}
                        <path
                          d="M18 4v12"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17 4h2"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    ),
                    walking: (
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Footprint trail */}
                        <ellipse
                          cx="7"
                          cy="16"
                          rx="2"
                          ry="3"
                          fill="white"
                          opacity="0.8"
                        />
                        <ellipse
                          cx="13"
                          cy="12"
                          rx="2"
                          ry="3"
                          fill="white"
                          opacity="0.6"
                        />
                        <ellipse
                          cx="8"
                          cy="8"
                          rx="2"
                          ry="3"
                          fill="white"
                          opacity="0.4"
                        />
                        {/* Foot detail (toes) */}
                        <circle cx="6.5" cy="14.5" r="0.3" fill="#333" />
                        <circle cx="7" cy="14.2" r="0.3" fill="#333" />
                        <circle cx="7.5" cy="14.5" r="0.3" fill="#333" />
                        <circle cx="12.5" cy="10.5" r="0.3" fill="#333" />
                        <circle cx="13" cy="10.2" r="0.3" fill="#333" />
                        <circle cx="13.5" cy="10.5" r="0.3" fill="#333" />
                        {/* Path/trail */}
                        <path
                          d="M2 20h20"
                          stroke="white"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                          opacity="0.5"
                        />
                        {/* Movement arrow */}
                        <path
                          d="M16 6l2 2-2 2M16 8h4"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  };
                  return icons[sport] || icons.running;
                };

                return (
                  <div
                    className="activity-item flex items-center gap-4 p-6 mb-4"
                    key={index}
                  >
                    <div className="sport-icon flex items-center justify-center">
                      {getSportIcon(route.sport)}
                    </div>
                    <div className="activity-details flex-1">
                      <h4 className="text-lg font-semibold">{route.name}</h4>
                      <p className="text-sm text-neutral-400">
                        {route.distance} km • {route.calories} cal •{" "}
                        {new Date(route.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="activity-stats text-right">
                      <div className="text-lg font-bold text-[#fb2576]">
                        {Math.floor(route.duration / 60)}:
                        {String(route.duration % 60).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-neutral-400">Duration</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400 mb-4">
                  No recent activities found.
                </p>
                <p className="text-sm text-neutral-500">
                  Start tracking your workouts to see them here!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div className="w-full px-4" style={{ marginTop: "160px" }}>
          <div
            className="goals-section w-full mx-auto"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Your Goals</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {goalWidgets.map(({ title, current, unit, progress, target }) => (
                <div
                  className="goal-widget flex flex-col justify-between"
                  key={title}
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{title}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {current.toLocaleString()}
                      </span>
                      <span className="text-sm text-neutral-400">{unit}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="goal-progress-track">
                      <div
                        className="goal-progress-bar"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-neutral-400">
                      <span>
                        {current} / {target} {unit.toLowerCase()}
                      </span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="w-full px-4" style={{ marginTop: "160px" }}>
          <div
            className="achievements-section w-full mx-auto"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Recent Achievements</h3>
            <div className="badges-grid grid grid-cols-3 gap-6">
              {achievements.map((badge, index) => (
                <div
                  className="achievement-badge p-4"
                  key={badge.name || index}
                >
                  <div className="badge-icon flex justify-center items-center mb-2">
                    {badge.icon}
                  </div>
                  <span className="badge-name text-sm text-center mt-2 block">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Feed Section */}
        <div
          className="w-full px-4"
          style={{ marginTop: "160px", marginBottom: "60px" }}
        >
          <div
            className="social-feed w-full mx-auto"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Friend Activity</h3>
            {friendActivities.length > 0 ? (
              friendActivities.map((activity, index) => (
                <div
                  className="friend-activity flex items-center gap-4 p-4 mb-4"
                  key={index}
                >
                  <img
                    src={activity.user.avatar}
                    alt={`${activity.user.name}'s avatar`}
                    className="w-12 h-12 rounded-full"
                  />
                  <p className="text-sm text-neutral-400">
                    {activity.user.name} completed a{" "}
                    <span className="font-semibold">{activity.distance}km</span>{" "}
                    run
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400 mb-4">
                  No friend activities found.
                </p>
                <p className="text-sm text-neutral-500">
                  Connect with friends to see their activities here!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
