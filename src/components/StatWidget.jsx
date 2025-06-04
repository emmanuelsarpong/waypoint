import React, { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const cardStyle = {
  background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
  border: "1px solid #2a2a2a",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  cursor: "pointer",
  width: 360,
  minHeight: 260,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const cardHoverStyle = {
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
  transform: "scale(1.02)",
};

export default function StatWidget({
  title,
  value,
  unit,
  data,
  color,
  onClick,
  children,
}) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      style={hover ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#fff",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "12px",
          color: "#fff",
        }}
      >
        {value}{" "}
        <span style={{ fontSize: "1rem", fontWeight: "500" }}>{unit}</span>
      </div>
      <div style={{ width: "100%", height: 60, marginBottom: 8 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {children}
    </div>
  );
}
