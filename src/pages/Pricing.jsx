import Button from "../components/Button";

function Pricing() {
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

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "700px",
    margin: "0 auto",
    padding: "20px",
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

      <div style={containerStyle}>
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
            onClick={() => {
              console.log(`Clicked on ${plan.name}`);
              // I will add Stripe checkout here
              // window.location.href = "/checkout";
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
