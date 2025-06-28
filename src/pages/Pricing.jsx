import React, { useState } from "react";
import { authFetch } from "../utils/authFetch";

function Pricing({ subscriptionStatus }) {
  const plans = [
    {
      name: "Free",
      description: "For casual movers and beginners.",
      price: "$0/month",
      features: [
        "30 activities/month",
        "Goal setting & streaks",
        "Basic performance stats",
        "Community leaderboard",
      ],
    },
    {
      name: "Pro",
      description: "Unlock insights & advanced tracking.",
      price: "$7/month",
      features: [
        "Unlimited activity logging",
        "Route history & GPS heatmaps",
        "Advanced analytics",
        "Strava + Apple Health integration",
      ],
    },
    {
      name: "Team",
      description: "Great for groups and wellness clubs.",
      price: "$25/month",
      features: [
        "Up to 10 members",
        "Shared dashboards",
        "Team goals & analytics",
        "Bulk user invites",
      ],
    },
  ];

  // Map plan names to Stripe price IDs
  const priceIds = {
    Pro: "price_1Rel4IPQH32NHq1Wejl3Rmjh",
    Team: "price_1ReluzPQH32NHq1WtduW4KqR",
  };

  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName) => {
    if (!priceIds[planName]) {
      alert(
        `${planName} plan pricing is not configured yet. Please contact support.`
      );
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ priceId: priceIds[planName] }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to start subscription. Please try again.");
    }
    setLoading(false);
  };

  const cardStyle = {
    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    cursor: "pointer",
  };

  const cardHoverStyle = {
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.6)",
    transform: "scale(1.02)",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  const descriptionStyle = {
    color: "#9ca3af",
    fontSize: "0.875rem",
    marginBottom: "20px",
  };

  const priceStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const featuresStyle = {
    listStyle: "none",
    padding: 0,
    margin: "0 0 20px",
  };

  const featureItemStyle = {
    color: "#d1d5db",
    fontSize: "0.875rem",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const checkmarkStyle = {
    color: "#10b981",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "40px 20px",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Our Plans
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.125rem" }}>
          Choose the plan that fits your movement journey.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
              e.currentTarget.style.transform = cardHoverStyle.transform;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardStyle.boxShadow;
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <h2 style={titleStyle}>{plan.name}</h2>
            <p style={descriptionStyle}>{plan.description}</p>
            <p style={priceStyle}>{plan.price}</p>
            <ul style={featuresStyle}>
              {plan.features.map((feature, i) => (
                <li key={i} style={featureItemStyle}>
                  <span style={checkmarkStyle}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {plan.name === "Free" ? (
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#4ade80",
                  color: "#111",
                }}
                disabled
              >
                Free Plan
              </button>
            ) : (
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor:
                    subscriptionStatus === plan.name
                      ? "#4ade80"
                      : priceIds[plan.name]
                      ? "#ff7eb3"
                      : "#6b7280",
                  color: "#111",
                  cursor: !priceIds[plan.name] ? "not-allowed" : "pointer",
                }}
                disabled={
                  loading ||
                  subscriptionStatus === plan.name ||
                  !priceIds[plan.name]
                }
                onClick={() => handleSubscribe(plan.name)}
              >
                {subscriptionStatus === plan.name
                  ? "Active"
                  : priceIds[plan.name]
                  ? "Subscribe"
                  : "Coming Soon"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
