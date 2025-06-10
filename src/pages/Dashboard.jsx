import React, { useState, useEffect } from "react";
import StatWidget from "../components/StatWidget";
import { authFetch } from "../utils/authFetch";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState("monthly");
  const [user, setUser] = useState(null);

  const getChartData = () => {
    if (range === "weekly") return weeklyData;
    if (range === "yearly") return yearlyData;
    return monthlyData;
  };

  const statWidgets = [
    {
      title: "Move",
      value: "1,173",
      unit: "CAL",
      color: "#fb2576",
      path: "/move",
    },
    {
      title: "Exercise",
      value: "101",
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

  useEffect(() => {
    // Fetch user info
    authFetch("/user/profile")
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.firstName) setUser(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
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
      </div>

      {/* Responsive grid styles */}
      <style>{`
        .dashboard-widget-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .dashboard-widget-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        @media (max-width: 700px) {
          .dashboard-widget-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
