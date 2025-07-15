import React, { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./TrackProgressPage.css";

const TrackProgressPage = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Sample data for charts
  const weeklyData = [
    { week: "Week 1", distance: 15.2, workouts: 4, calories: 1200 },
    { week: "Week 2", distance: 18.5, workouts: 5, calories: 1450 },
    { week: "Week 3", distance: 22.1, workouts: 6, calories: 1680 },
    { week: "Week 4", distance: 25.8, workouts: 7, calories: 1920 },
  ];

  const monthlyData = [
    { month: "Jan", distance: 85.2, workouts: 20, calories: 6200 },
    { month: "Feb", distance: 92.1, workouts: 22, calories: 6800 },
    { month: "Mar", distance: 108.5, workouts: 26, calories: 7450 },
    { month: "Apr", distance: 125.3, workouts: 30, calories: 8200 },
    { month: "May", distance: 142.7, workouts: 34, calories: 9100 },
    { month: "Jun", distance: 156.2, workouts: 38, calories: 9800 },
  ];

  const yearlyData = [
    { year: "2023", distance: 1240, workouts: 280, calories: 89000 },
    { year: "2024", distance: 1456, workouts: 324, calories: 98500 },
    { year: "2025", distance: 945, workouts: 210, calories: 67200 }, // Current year partial
  ];


  const goalProgress = [
    { goal: "Weekly Distance", current: 35.2, target: 50, percentage: 70.4 },
    { goal: "Monthly Workouts", current: 12, target: 20, percentage: 60 },
    { goal: "Annual Distance", current: 945, target: 1500, percentage: 63 },
    { goal: "Calories Burned", current: 4200, target: 6000, percentage: 70 },
  ];

  const personalRecords = [
    {
      activity: "Longest Run",
      value: "21.1 km",
      date: "Mar 15, 2025",
      improvement: "+2.3 km",
    },
    {
      activity: "Fastest 5K",
      value: "22:45",
      date: "Apr 2, 2025",
      improvement: "-1:23",
    },
    {
      activity: "Most Calories",
      value: "856 cal",
      date: "May 8, 2025",
      improvement: "+89 cal",
    },
    {
      activity: "Highest Elevation",
      value: "1,250 m",
      date: "Jun 12, 2025",
      improvement: "+340 m",
    },
  ];

  const getCurrentData = () => {
    switch (timeframe) {
      case "week":
        return weeklyData;
      case "year":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 pb-32">
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 tracking-tight">
          Track Your Progress
        </h1>

        {/* Stats Overview */}
        <div
          className="dashboard-widget-grid"
          style={{
            margin: "0 auto 40px auto",
            width: "100%",
            maxWidth: "1080px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              cursor: "pointer",
              width: "100%",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏃</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#fff",
              }}
            >
              Total Distance
            </h3>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#fff",
              }}
            >
              1,847{" "}
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>km</span>
            </div>
            <div style={{ color: "#10b981" }}>+12.5% this month</div>
          </div>

          <div
            style={{
              background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              cursor: "pointer",
              width: "100%",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔥</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#fff",
              }}
            >
              Calories Burned
            </h3>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#fff",
              }}
            >
              67,200{" "}
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>cal</span>
            </div>
            <div style={{ color: "#10b981" }}>+8.3% this month</div>
          </div>

          <div
            style={{
              background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              cursor: "pointer",
              width: "100%",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>💪</div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#fff",
              }}
            >
              Workouts
            </h3>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                marginBottom: "12px",
                color: "#fff",
              }}
            >
              210{" "}
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>total</span>
            </div>
            <div style={{ color: "#10b981" }}>+5.2% this month</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="w-full px-4">
          <div
            className="w-full mx-auto"
            style={{
              maxWidth: "1080px",
              marginBottom: "40px",
            }}
          >
            <div className="flex justify-center mb-6">
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "1rem",
                }}
              >
                Performance Analytics
              </h2>
            </div>
            <div className="flex justify-center mb-10">
              <div className="flex items-center gap-2 bg-[#0e0e0e] p-1 rounded-lg">
                {["weekly", "monthly", "yearly"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeframe(r)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeframe === r
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance Progress Chart */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "#fff",
                }}
              >
                Distance Progress
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getCurrentData()}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis
                      dataKey={
                        timeframe === "week"
                          ? "week"
                          : timeframe === "year"
                          ? "year"
                          : "month"
                      }
                      stroke="rgba(255,255,255,0.6)"
                    />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="distance"
                      stroke="#3b82f6"
                      fill="url(#distanceGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient
                        id="distanceGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Tracking */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Goal Progress</h2>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            {goalProgress.map((goal) => (
              <div
                key={goal.goal}
                style={{
                  background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  cursor: "pointer",
                  width: "100%",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {goal.goal}
                  </h3>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      color: "#fb2576",
                    }}
                  >
                    {goal.percentage.toFixed(1)}%
                  </span>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#2a2a2a",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${goal.percentage}%`,
                        height: "100%",
                        background:
                          "linear-gradient(to right, #fb2576, #8f4eea)",
                        borderRadius: "4px",
                        transition: "width 1s ease",
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#9ca3af",
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "#fff" }}>
                    {goal.current}
                  </span>
                  <span>/ {goal.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Records */}
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Personal Records
          </h2>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            {personalRecords.map((record) => (
              <div
                key={record.activity}
                style={{
                  background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                  cursor: "pointer",
                  width: "100%",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <h4
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  {record.activity}
                </h4>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#fb2576",
                    marginBottom: "0.5rem",
                  }}
                >
                  {record.value}
                </div>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {record.date}
                </div>
                <div
                  style={{
                    padding: "4px 8px",
                    background: "rgba(16, 185, 129, 0.2)",
                    color: "#10b981",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    alignSelf: "flex-start",
                  }}
                >
                  {record.improvement}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProgressPage;
