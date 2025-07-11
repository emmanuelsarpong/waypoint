import React, { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

function Pricing({ user }) {
  const [subscriptionData, setSubscriptionData] = useState({
    status: "inactive",
    plan: null,
  });
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
    Pro: "price_1Rel4IPQH32NHq1WejI3Rmjh",
    Team: "price_1ReluzPQH32NHq1WtduW4KqR",
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      if (!user) return;

      try {
        const res = await authFetch("/api/billing/subscription-status");
        if (res.ok) {
          const data = await res.json();
          setSubscriptionData(data);
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err);
      }
    }
    fetchSubscriptionStatus();
  }, [user]);

  const getButtonText = (planName) => {
    if (!user) {
      return "Login to Subscribe";
    }

    const currentPlan = subscriptionData.plan;
    const isActive = subscriptionData.status === "active";

    if (isActive && currentPlan === planName) {
      return "Current Plan";
    }

    if (isActive && currentPlan && currentPlan !== planName) {
      // User has a different plan
      if (
        (currentPlan === "Pro" && planName === "Team") ||
        (currentPlan === "Free" && (planName === "Pro" || planName === "Team"))
      ) {
        return "Upgrade";
      } else if (
        (currentPlan === "Team" && planName === "Pro") ||
        ((currentPlan === "Pro" || currentPlan === "Team") &&
          planName === "Free")
      ) {
        return "Downgrade";
      }
    }

    return priceIds[planName] ? "Subscribe" : "Coming Soon";
  };

  const getButtonColor = (planName) => {
    const buttonText = getButtonText(planName);

    if (buttonText === "Current Plan") return "#4ade80";
    if (buttonText === "Upgrade") return "#ff7eb3";
    if (buttonText === "Downgrade") return "#fbbf24";
    if (buttonText === "Login to Subscribe") return "#6b7280";
    if (buttonText === "Coming Soon") return "#6b7280";
    return "#ff7eb3"; // Default subscribe color
  };

  const handleSubscribe = async (planName) => {
    // Debug logs removed for production

    if (!priceIds[planName]) {
      alert(
        `${planName} plan pricing is not configured yet. Please contact support.`
      );
      return;
    }

    // Check if user is logged in
    if (!user) {
      // No user found, redirecting to login
      alert("Please log in to subscribe to a plan.");
      window.location.href = "/login";
      return;
    }

    // Starting subscription process
    setLoading(true);
    try {
      // Making API call to create checkout session
      const res = await authFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ priceId: priceIds[planName] }),
      });

      // Response processing (debug logs removed)

      if (!res.ok) {
        if (res.status === 401) {
          // 401 Unauthorized - redirecting to login
          alert("Please log in to subscribe to a plan.");
          window.location.href = "/login";
          return;
        }
        const errorData = await res.json();
        // Error data processed (debug removed)
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await res.json();
      // Success data processed (debug removed)
      if (data.url) {
        // Redirecting to Stripe Checkout
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        // No URL in response
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert(err.message || "Failed to start subscription. Please try again.");
    } finally {
      setLoading(false);
    }
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
                  backgroundColor: getButtonColor(plan.name),
                  color: "#111",
                  cursor:
                    !priceIds[plan.name] ||
                    !user ||
                    getButtonText(plan.name) === "Current Plan"
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={
                  loading ||
                  getButtonText(plan.name) === "Current Plan" ||
                  getButtonText(plan.name) === "Coming Soon" ||
                  !user
                }
                onClick={() => handleSubscribe(plan.name)}
              >
                {getButtonText(plan.name)}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
