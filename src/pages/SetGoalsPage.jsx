import React, { useState } from "react";

const SetGoalsPage = () => {
  const [selectedGoalType, setSelectedGoalType] = useState("distance");
  const [goals, setGoals] = useState([
    {
      id: 1,
      type: "Weekly Distance",
      current: 35.2,
      target: 50,
      unit: "km",
      progress: 70.4,
      status: "active",
      deadline: "End of week",
      category: "distance",
    },
    {
      id: 2,
      type: "Monthly Runs",
      current: 12,
      target: 20,
      unit: "runs",
      progress: 60,
      status: "active",
      deadline: "End of month",
      category: "frequency",
    },
    {
      id: 3,
      type: "10K Personal Best",
      current: "45:23",
      target: "42:00",
      unit: "",
      progress: 85,
      status: "active",
      deadline: "Next race",
      category: "performance",
    },
    {
      id: 4,
      type: "Annual Distance",
      current: 1247,
      target: 2000,
      unit: "km",
      progress: 62.4,
      status: "active",
      deadline: "End of year",
      category: "distance",
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    type: "",
    target: "",
    deadline: "",
    category: "distance",
  });

  const [showGoalForm, setShowGoalForm] = useState(false);

  const goalCategories = [
    { id: "distance", name: "Distance", icon: "📏", color: "#3b82f6" },
    { id: "frequency", name: "Frequency", icon: "📅", color: "#10b981" },
    { id: "performance", name: "Performance", icon: "⚡", color: "#f59e0b" },
    { id: "health", name: "Health", icon: "❤️", color: "#ef4444" },
  ];

  const goalTemplates = [
    {
      name: "Run 5K three times a week",
      category: "frequency",
      target: 3,
      unit: "runs/week",
    },
    {
      name: "Complete 50km this month",
      category: "distance",
      target: 50,
      unit: "km",
    },
    {
      name: "Improve 10K time by 2 minutes",
      category: "performance",
      target: 120,
      unit: "seconds",
    },
    {
      name: "Burn 500 calories per workout",
      category: "health",
      target: 500,
      unit: "calories",
    },
    {
      name: "Run a half marathon",
      category: "distance",
      target: 21.1,
      unit: "km",
    },
    {
      name: "Exercise 5 days a week",
      category: "frequency",
      target: 5,
      unit: "days/week",
    },
  ];

  const motivationalQuotes = [
    "The only impossible journey is the one you never begin.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Don't limit your challenges, challenge your limits.",
    "Every mile begins with a single step.",
  ];

  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const filteredGoals =
    selectedGoalType === "all"
      ? goals
      : goals.filter((goal) => goal.category === selectedGoalType);

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (newGoal.type && newGoal.target && newGoal.deadline) {
      const goal = {
        id: Date.now(),
        type: newGoal.type,
        current: 0,
        target: parseFloat(newGoal.target),
        unit: getUnitForCategory(newGoal.category),
        progress: 0,
        status: "active",
        deadline: newGoal.deadline,
        category: newGoal.category,
      };
      setGoals([...goals, goal]);
      setNewGoal({ type: "", target: "", deadline: "", category: "distance" });
      setShowGoalForm(false);
    }
  };

  const getUnitForCategory = (category) => {
    switch (category) {
      case "distance":
        return "km";
      case "frequency":
        return "times";
      case "performance":
        return "min";
      case "health":
        return "cal";
      default:
        return "";
    }
  };

  const updateGoalProgress = (goalId, newCurrent) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const progress = (newCurrent / goal.target) * 100;
          return {
            ...goal,
            current: newCurrent,
            progress: Math.min(progress, 100),
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter((goal) => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4 pb-32">
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-10 tracking-tight">
          Set Your Goals
        </h1>

        {/* Motivational Quote */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>💫</span>
            <span
              style={{
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "#d1d5db",
              }}
            >
              &ldquo;{currentQuote}&rdquo;
            </span>
          </div>
        </div>

        {/* Goal Categories Filter */}
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
            <div className="flex justify-center mb-4">
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Filter by Category
              </h3>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className={`category-btn ${
                  selectedGoalType === "all" ? "active" : ""
                }`}
                onClick={() => setSelectedGoalType("all")}
                style={{
                  padding: "8px 16px",
                  background:
                    selectedGoalType === "all"
                      ? "linear-gradient(to bottom right, #fb2576, #8f4eea)"
                      : "#1a1a1a",
                  border:
                    selectedGoalType === "all" ? "none" : "1px solid #2a2a2a",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                All Goals
              </button>
              {goalCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${
                    selectedGoalType === category.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedGoalType(category.id)}
                  style={{
                    padding: "8px 16px",
                    background:
                      selectedGoalType === category.id
                        ? "linear-gradient(to bottom right, #fb2576, #8f4eea)"
                        : "#1a1a1a",
                    border:
                      selectedGoalType === category.id
                        ? "none"
                        : "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "white",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Goals */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2 className="text-3xl font-bold">Your Current Goals</h2>
            <button
              onClick={() => setShowGoalForm(true)}
              style={{
                padding: "12px 24px",
                background:
                  "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              + Add New Goal
            </button>
          </div>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        color: "#fff",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {goal.type}
                    </h3>
                    <span style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
                      📅 {goal.deadline}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                      onClick={() => {
                        /* Edit goal logic */
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "none",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem",
                      }}
                      onClick={() => deleteGoal(goal.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {goal.current}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                        {goal.unit}
                      </span>
                    </div>
                    <div style={{ fontSize: "1.25rem", color: "#6b7280" }}>
                      /
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: "#fb2576",
                        }}
                      >
                        {goal.target}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                        {goal.unit}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: "0.5rem" }}>
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
                          width: `${goal.progress}%`,
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
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#fb2576",
                    }}
                  >
                    {goal.progress.toFixed(1)}%
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    placeholder="Update progress..."
                    style={{
                      flex: 1,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      color: "white",
                      fontSize: "0.875rem",
                    }}
                    onBlur={(e) => {
                      if (e.target.value) {
                        updateGoalProgress(goal.id, parseFloat(e.target.value));
                        e.target.value = "";
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        updateGoalProgress(goal.id, parseFloat(e.target.value));
                        e.target.value = "";
                      }
                    }}
                  />
                  <div>
                    <span
                      style={{
                        padding: "0.375rem 0.75rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        background:
                          goal.status === "active"
                            ? "rgba(59, 130, 246, 0.2)"
                            : "rgba(16, 185, 129, 0.2)",
                        color: goal.status === "active" ? "#93c5fd" : "#6ee7b7",
                        border: `1px solid ${
                          goal.status === "active"
                            ? "rgba(59, 130, 246, 0.3)"
                            : "rgba(16, 185, 129, 0.3)"
                        }`,
                      }}
                    >
                      {goal.status === "active" ? "🎯 Active" : "✅ Completed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Templates */}
        <div className="w-full max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Popular Goal Templates
          </h2>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            {goalTemplates.map((template, index) => (
              <div
                key={index}
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
                  justifyContent: "space-between",
                  textAlign: "center",
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
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    {
                      goalCategories.find((cat) => cat.id === template.category)
                        ?.icon
                    }
                  </div>
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "#fff",
                    }}
                  >
                    {template.name}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#fff" }}>
                      {template.target} {template.unit}
                    </span>
                    <span
                      style={{
                        fontWeight: "500",
                        color: goalCategories.find(
                          (cat) => cat.id === template.category
                        )?.color,
                      }}
                    >
                      {
                        goalCategories.find(
                          (cat) => cat.id === template.category
                        )?.name
                      }
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    background:
                      "linear-gradient(to bottom right, #fb2576, #8f4eea)",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={() => {
                    setNewGoal({
                      type: template.name,
                      target: template.target.toString(),
                      deadline: "",
                      category: template.category,
                    });
                    setShowGoalForm(true);
                  }}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Goal Statistics */}
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Your Goal Statistics
          </h2>
          <div
            className="dashboard-widget-grid"
            style={{ margin: "0 auto", width: "100%", maxWidth: "1080px" }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
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
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎯</div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "#fff",
                }}
              >
                Active Goals
              </h3>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "#fb2576",
                }}
              >
                {goals.filter((g) => g.status === "active").length}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
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
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✅</div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "#fff",
                }}
              >
                Completed Goals
              </h3>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {goals.filter((g) => g.status === "completed").length}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
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
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📈</div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "#fff",
                }}
              >
                Average Progress
              </h3>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "#f59e0b",
                }}
              >
                {goals.length > 0
                  ? Math.round(
                      goals.reduce((sum, goal) => sum + goal.progress, 0) /
                        goals.length
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "500px",
              color: "#1f2937",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "2rem 2rem 1rem",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
                Create New Goal
              </h3>
              <button
                onClick={() => setShowGoalForm(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "8px",
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGoal} style={{ padding: "2rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#374151",
                  }}
                >
                  Goal Type
                </label>
                <input
                  type="text"
                  value={newGoal.type}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, type: e.target.value })
                  }
                  placeholder="e.g., Run 5K three times a week"
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    background: "white",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#374151",
                  }}
                >
                  Target Value
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                  placeholder="e.g., 50"
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    background: "white",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#374151",
                  }}
                >
                  Category
                </label>
                <select
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    background: "white",
                  }}
                >
                  {goalCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#374151",
                  }}
                >
                  Deadline
                </label>
                <input
                  type="text"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                  placeholder="e.g., End of month"
                  required
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    background: "white",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  style={{
                    background: "#6b7280",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    padding: "0.875rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetGoalsPage;
