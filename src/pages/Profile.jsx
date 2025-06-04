import React from "react";
import Button from "../components/Button";
import StatWidget from "../components/StatWidget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Example data for each stat
const moveData = [
  { name: "12AM", value: 100 },
  { name: "6AM", value: 300 },
  { name: "12PM", value: 700 },
  { name: "6PM", value: 1173 },
];
const exerciseData = [
  { name: "12AM", value: 0 },
  { name: "6AM", value: 10 },
  { name: "12PM", value: 60 },
  { name: "6PM", value: 101 },
];
const standData = [
  { name: "12AM", value: 2 },
  { name: "6AM", value: 5 },
  { name: "12PM", value: 8 },
  { name: "6PM", value: 10 },
];
const stepData = [
  { name: "12AM", value: 0 },
  { name: "6AM", value: 2000 },
  { name: "12PM", value: 5000 },
  { name: "6PM", value: 6829 },
];
const distanceData = [
  { name: "12AM", value: 0 },
  { name: "6AM", value: 1.2 },
  { name: "12PM", value: 3.5 },
  { name: "6PM", value: 4.84 },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 xl:p-12">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-extrabold text-center mb-12">
          Your Dashboard
        </h1>

        {/* Stat Widgets */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 360px)",
            gap: "32px",
            justifyContent: "center",
            marginBottom: "48px",
          }}
        >
          <StatWidget
            title="Move"
            value="1,173"
            unit="CAL"
            data={moveData}
            color="#fb2576"
            onClick={() => alert("Show Move details")}
          />
          <StatWidget
            title="Exercise"
            value="101"
            unit="MIN"
            data={exerciseData}
            color="#caff70"
            onClick={() => alert("Show Exercise details")}
          />
          <StatWidget
            title="Stand"
            value="10"
            unit="HRS"
            data={standData}
            color="#00f0ff"
            onClick={() => alert("Show Stand details")}
          />
          <StatWidget
            title="Step Count"
            value="6,829"
            unit=""
            data={stepData}
            color="#b39ddb"
            onClick={() => alert("Show Step Count details")}
          />
          <StatWidget
            title="Step Distance"
            value="4.84"
            unit="KM"
            data={distanceData}
            color="#40c4ff"
            onClick={() => alert("Show Step Distance details")}
          />
          <StatWidget
            title="Sessions"
            value="1.11"
            unit="KM"
            data={distanceData}
            color="#76ff03"
            onClick={() => alert("Show Sessions details")}
          >
            <div className="text-xs text-neutral-400 mt-2">Outdoor Walk</div>
          </StatWidget>
        </div>

        {/* Weekly Progress Line Chart */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "64px",
            marginBottom: "0",
          }}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
              border: "1px solid #2a2a2a",
              borderRadius: "12px",
              padding: "32px 24px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
              width: 1144,
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "24px",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Weekly Progress
            </h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={distanceData}>
                  <XAxis dataKey="name" stroke="#fff" />
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

        {/* CTA Button */}
        {/* <div className="mt-12 flex justify-center">
          <Button className="bg-white text-black hover:bg-zinc-200 shadow-md px-6 py-3 rounded-xl">
            Log New Activity
          </Button>
        </div> */}
      </div>
    </div>
  );
}
