import React from "react";

const WorkingMap: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px", padding: "40px" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🗺️</div>
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            margin: "0 0 16px 0",
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Waypoint Premium
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#a0a0a0",
            margin: "0 0 32px 0",
            lineHeight: "1.6",
          }}
        >
          Professional route tracking & analytics platform
        </p>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "32px",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "#3b82f6" }}>
            ✨ Premium Features
          </h3>
          <ul
            style={{
              textAlign: "left",
              color: "#e5e5e5",
              lineHeight: "1.8",
              margin: 0,
              paddingLeft: "20px",
            }}
          >
            <li>🎯 Interactive route creation</li>
            <li>📊 Real-time analytics & insights</li>
            <li>🌙 Beautiful dark theme interface</li>
            <li>📱 Mobile-responsive design</li>
            <li>⚡ Lightning-fast performance</li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              color: "white",
              border: "none",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(59, 130, 246, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(59, 130, 246, 0.3)";
            }}
          >
            🚀 Start Tracking
          </button>

          <button
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              padding: "14px 30px",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            📖 Learn More
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          fontSize: "0.875rem",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Premium mapping experience • Built with React & TypeScript
      </div>
    </div>
  );
};

export default WorkingMap;
