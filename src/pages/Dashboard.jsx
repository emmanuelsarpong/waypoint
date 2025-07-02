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
          setUserStats(data);
          setRecentRoutes(data.recentRoutes || []); 
          setFriendActivities(data.friendActivities || []); 
        })
        .catch((error) => {
          console.error("Error fetching user stats:", error);
          // Set default empty state on error
          setUserStats({
            totalDistance: 0,
            totalRoutes: 0,
            totalCalories: 0,
            weeklyData: [],
          });
          setRecentRoutes([]);
          setFriendActivities([]);
        });
    }
  }, [user]);

  const getChartData = () => {
    if (range === "weekly") return userStats.weeklyData;
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
    { name: "First Steps", icon: "👣" },
    { name: "10km Club", icon: "🏅" },
    { name: "Marathon Master", icon: "🏆" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 pb-20">
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
        <div className="w-full px-4">
          <div
            className="recent-activities w-full mx-auto mt-10"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Recent Activities</h3>
            {recentRoutes.length > 0 ? (
              recentRoutes.map((route, index) => {
                const getSportIcon = (sport) => {
                  const icons = {
                    running: "🏃",
                    cycling: "🚴",
                    hiking: "🥾",
                    walking: "🚶",
                  };
                  return icons[sport] || "🏃";
                };

                return (
                  <div
                    className="activity-item flex items-center gap-4 p-6 mb-4"
                    key={index}
                  >
                    <span className="sport-icon text-3xl">
                      {getSportIcon(route.sport)}
                    </span>
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
        <div className="w-full px-4">
          <div
            className="goals-section w-full mx-auto mt-10"
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
        <div className="w-full px-4">
          <div
            className="achievements-section w-full mx-auto mt-10"
            style={{ maxWidth: "1080px" }}
          >
            <h3 className="text-2xl font-bold mb-6">Recent Achievements</h3>
            <div className="badges-grid grid grid-cols-3 gap-6">
              {achievements.map((badge, index) => (
                <div
                  className="achievement-badge p-4"
                  key={badge.name || index}
                >
                  <span className="badge-icon text-4xl">{badge.icon}</span>
                  <span className="badge-name text-sm text-center mt-2">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Feed Section */}
        <div className="w-full px-4">
          <div
            className="social-feed w-full mx-auto mt-10"
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
