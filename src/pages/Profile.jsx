import React from "react";
import Button from "../components/Button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Card = ({ children, className }) => (
  <div
    className={`rounded-xl shadow-md p-6 bg-white text-black ${
      className || ""
    }`}
  >
    {children}
  </div>
);
const CardContent = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const data = [
  { name: "Mon", distance: 2.3 },
  { name: "Tue", distance: 3.1 },
  { name: "Wed", distance: 4.0 },
  { name: "Thu", distance: 3.7 },
  { name: "Fri", distance: 5.2 },
  { name: "Sat", distance: 6.1 },
  { name: "Sun", distance: 4.9 },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 text-black">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">This Week’s Distance</h2>
            <p className="text-3xl font-bold">29.3 km</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-300 via-blue-300 to-purple-300 text-black">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Your Longest Run</h2>
            <p className="text-3xl font-bold">6.1 km</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-300 via-cyan-300 to-blue-300 text-black">
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Active Days</h2>
            <p className="text-3xl font-bold">6/7</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 bg-zinc-900 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="distance"
              stroke="#f472b6"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-8 text-center">
        <Button className="bg-white text-black hover:bg-zinc-200">
          Log New Activity
        </Button>
      </div>
    </div>
  );
}
