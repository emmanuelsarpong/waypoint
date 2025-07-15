import React, { useState } from "react";
import "./ExploreTrailsPage.css";

const ExploreTrailsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const [trails] = useState([
    {
      id: 1,
      name: "Mountain Ridge Trail",
      location: "Rocky Mountains, CO",
      distance: 8.5,
      difficulty: "hard",
      type: "hiking",
      elevation: 1200,
      duration: "4-6 hours",
      rating: 4.8,
      reviews: 324,
      image: "/api/placeholder/400/250",
      description:
        "Challenging mountain trail with breathtaking panoramic views",
    },
    {
      id: 2,
      name: "Riverside Cycling Path",
      location: "Portland, OR",
      distance: 12.3,
      difficulty: "medium",
      type: "cycling",
      elevation: 200,
      duration: "1-2 hours",
      rating: 4.6,
      reviews: 189,
      image: "/api/placeholder/400/250",
      description: "Scenic cycling route along the beautiful riverside",
    },
    {
      id: 3,
      name: "Forest Loop Trail",
      location: "Olympic National Park, WA",
      distance: 5.2,
      difficulty: "easy",
      type: "hiking",
      elevation: 300,
      duration: "2-3 hours",
      rating: 4.7,
      reviews: 456,
      image: "/api/placeholder/400/250",
      description: "Family-friendly trail through old-growth forest",
    },
    {
      id: 4,
      name: "Coastal Running Route",
      location: "Big Sur, CA",
      distance: 6.8,
      difficulty: "medium",
      type: "running",
      elevation: 400,
      duration: "45-60 min",
      rating: 4.9,
      reviews: 278,
      image: "/api/placeholder/400/250",
      description: "Stunning coastal views with moderate terrain challenges",
    },
    {
      id: 5,
      name: "Urban Discovery Walk",
      location: "San Francisco, CA",
      distance: 3.4,
      difficulty: "easy",
      type: "walking",
      elevation: 150,
      duration: "1-2 hours",
      rating: 4.5,
      reviews: 134,
      image: "/api/placeholder/400/250",
      description: "Explore historic neighborhoods and hidden gems",
    },
    {
      id: 6,
      name: "Alpine Adventure Trail",
      location: "Mount Rainier, WA",
      distance: 14.2,
      difficulty: "hard",
      type: "hiking",
      elevation: 2100,
      duration: "6-8 hours",
      rating: 4.9,
      reviews: 89,
      image: "/api/placeholder/400/250",
      description: "Challenging alpine route for experienced hikers",
    },
  ]);

  const difficulties = [
    { id: "all", name: "All Levels", color: "#6b7280" },
    { id: "easy", name: "Easy", color: "#10b981" },
    { id: "medium", name: "Medium", color: "#f59e0b" },
    { id: "hard", name: "Hard", color: "#ef4444" },
  ];

  const trailTypes = [
    { id: "all", name: "All Types", icon: "🚶" },
    { id: "hiking", name: "Hiking", icon: "🥾" },
    { id: "cycling", name: "Cycling", icon: "🚴" },
    { id: "running", name: "Running", icon: "🏃" },
    { id: "walking", name: "Walking", icon: "🚶" },
  ];

  const filteredTrails = trails.filter((trail) => {
    const matchesSearch =
      trail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trail.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || trail.difficulty === selectedDifficulty;
    const matchesType = selectedType === "all" || trail.type === selectedType;

    return matchesSearch && matchesDifficulty && matchesType;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="explore-trails-page min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 pb-32">
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 tracking-tight">
          Explore New Trails
        </h1>

        {/* Search Section */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "20px",
                fontSize: "1.25rem",
                color: "#9ca3af",
                zIndex: 1,
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search trails by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "20px 20px 20px 60px",
                background: "rgba(26, 26, 26, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                color: "white",
                fontSize: "1.1rem",
                outline: "none",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid #fb2576";
                e.target.style.boxShadow = "0 0 0 2px rgba(251, 37, 118, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <div
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Difficulty Filter */}
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "16px",
                }}
              >
                Difficulty
              </h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    style={{
                      padding: "10px 20px",
                      background:
                        selectedDifficulty === difficulty.id
                          ? difficulty.color
                          : "#1a1a1a",
                      border:
                        selectedDifficulty === difficulty.id
                          ? "none"
                          : "1px solid #2a2a2a",
                      borderRadius: "8px",
                      color:
                        selectedDifficulty === difficulty.id
                          ? "white"
                          : "#9ca3af",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "0.875rem",
                    }}
                  >
                    {difficulty.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Trail Type Filter */}
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "16px",
                }}
              >
                Activity Type
              </h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {trailTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    style={{
                      padding: "10px 20px",
                      background:
                        selectedType === type.id
                          ? "linear-gradient(to bottom right, #fb2576, #8f4eea)"
                          : "#1a1a1a",
                      border:
                        selectedType === type.id ? "none" : "1px solid #2a2a2a",
                      borderRadius: "8px",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{type.icon}</span>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trails Grid */}
        <div
          className="dashboard-widget-grid"
          style={{
            margin: "0 auto 40px auto",
            width: "100%",
            maxWidth: "1080px",
          }}
        >
          {filteredTrails.map((trail) => (
            <div
              key={trail.id}
              className="trail-card"
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
                cursor: "pointer",
                width: "100%",
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.6)";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.4)";
                e.target.style.transform = "scale(1)";
              }}
            >
              <div className="trail-header">
                <h3
                  className="trail-name"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    marginBottom: "8px",
                    color: "#fff",
                    lineHeight: "1.3",
                  }}
                >
                  {trail.name}
                </h3>
                <div
                  className="trail-badges"
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    className="difficulty-badge"
                    style={{
                      backgroundColor: getDifficultyColor(trail.difficulty),
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      color: "white",
                    }}
                  >
                    {trail.difficulty}
                  </span>
                  <span
                    className="type-badge"
                    style={{
                      backgroundColor: "rgba(251, 37, 118, 0.1)",
                      border: "1px solid rgba(251, 37, 118, 0.3)",
                      color: "#fb2576",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>
                      {trailTypes.find((t) => t.id === trail.type)?.icon}
                    </span>
                    {trail.type}
                  </span>
                </div>
              </div>

              <p
                className="trail-location"
                style={{
                  color: "#9ca3af",
                  marginBottom: "12px",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📍</span> {trail.location}
              </p>
              <p
                className="trail-description"
                style={{
                  color: "#b3b3b3",
                  fontSize: "0.9rem",
                  marginBottom: "20px",
                  lineHeight: "1.5",
                }}
              >
                {trail.description}
              </p>

              <div
                className="trail-stats"
                style={{
                  marginTop: "auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  padding: "16px 0",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  className="stat-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📏</span>
                  <div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {trail.distance} km
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      Distance
                    </div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>⛰️</span>
                  <div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {trail.elevation}m
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      Elevation
                    </div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>⏱️</span>
                  <div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {trail.duration}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      Duration
                    </div>
                  </div>
                </div>
                <div
                  className="stat-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>⭐</span>
                  <div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: "#fff",
                      }}
                    >
                      {trail.rating}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                      {trail.reviews} reviews
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="trail-actions"
                style={{ marginTop: "16px", display: "flex", gap: "8px" }}
              >
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    background:
                      "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  View Details
                </button>
                <button
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Start Trail
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            🤖 AI Recommendations
          </h2>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            <div
              className="recommendation-card"
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
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div
                className="recommendation-icon"
                style={{ fontSize: "2rem", marginBottom: "1rem" }}
              >
                🎯
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  color: "#fff",
                }}
              >
                Perfect for Your Level
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                Based on your recent 5km runs, we recommend the Riverside
                Cycling Path for cross-training.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background:
                    "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Explore Now
              </button>
            </div>

            <div
              className="recommendation-card"
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
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div
                className="recommendation-icon"
                style={{ fontSize: "2rem", marginBottom: "1rem" }}
              >
                🌟
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  color: "#fff",
                }}
              >
                Popular This Week
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                Forest Loop Trail is trending among users with similar fitness
                profiles.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background:
                    "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Check It Out
              </button>
            </div>

            <div
              className="recommendation-card"
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
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <div
                className="recommendation-icon"
                style={{ fontSize: "2rem", marginBottom: "1rem" }}
              >
                🏆
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  color: "#fff",
                }}
              >
                Challenge Yourself
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                Ready for the next level? Mountain Ridge Trail will push your
                limits.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  background:
                    "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Take Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTrailsPage;
