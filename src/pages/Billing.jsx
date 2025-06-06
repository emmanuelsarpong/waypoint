import React, { useState } from "react";

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

  // Credit card state
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardMsg, setCardMsg] = useState("");

  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState("Active");

  // Dummy payment history
  const payments = [
    { date: "2025-06-01", amount: "$10.00", method: "Visa", status: "Paid" },
    { date: "2025-05-01", amount: "$10.00", method: "Visa", status: "Paid" },
  ];

  const handleCardUpdate = (e) => {
    e.preventDefault();
    setCardMsg("Credit card updated!");
  };

  const handleCancelSubscription = () => {
    setSubscriptionStatus("Cancelled");
  };

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

  // You can reuse inputStyle and buttonStyle from your Settings page for consistency.
  const inputStyle = {
    padding: "12px",
    border: "1px solid #3f3f3f",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "1rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #3f3f3f",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "10px",
    boxSizing: "border-box",
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

        {/* Separator */}
        <div
          style={{
            margin: "100px 0",
            width: "100%",
            borderTop: "0.5px solid rgba(255,255,255,0.10)",
          }}
        />

        {/* Update Credit Card Section */}
        <div
          style={{
            ...cardStyle,
            maxWidth: "100%",
            cursor: "default",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Update Payment Method
          </h2>
          <form
            onSubmit={handleCardUpdate}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              type="text"
              placeholder="Card Number"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              required
              maxLength={19}
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                maxLength={5}
                style={{ ...inputStyle, flex: 1 }}
              />
              <input
                type="text"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                maxLength={4}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <button type="submit" style={buttonStyle}>
              Update Card
            </button>
            {cardMsg && (
              <p style={{ color: "#4ade80", marginTop: 8 }}>{cardMsg}</p>
            )}
          </form>
        </div>

        {/* Separator */}
        <div
          style={{
            margin: "100px 0",
            width: "100%",
            borderTop: "0.5px solid rgba(255,255,255,0.10)",
          }}
        />

        {/* Subscription Management Section */}
        <div
          style={{
            ...cardStyle,
            maxWidth: "100%",
            cursor: "default",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Subscription Status
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              Status:{" "}
              <span
                style={{
                  color:
                    subscriptionStatus === "Active"
                      ? "#4ade80"
                      : "#f87171",
                }}
              >
                {subscriptionStatus === "Active" ? "Active" : "Cancelled"}
              </span>
            </div>
            {subscriptionStatus === "Active" ? (
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#ff7eb3",
                  color: "#111",
                }}
                onClick={handleCancelSubscription}
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#4ade80",
                  color: "#111",
                }}
                onClick={() => setSubscriptionStatus("Active")}
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Separator before Payment History */}
      <div
        style={{
          margin: "100px 0",
          width: "100%",
          borderTop: "0.5px solid rgba(255,255,255,0.10)",
        }}
      />

      {/* Payment History Section */}
      <div
        style={{
          marginTop: 0,
          padding: "40px 20px",
          borderRadius: "12px",
          background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
          border: "1px solid #2a2a2a",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h2
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
        >
          Payment History
        </h2>
        <table
          style={{
            width: "100%",
            color: "#fff",
            borderCollapse: "collapse",
            fontSize: "1rem",
          }}
        >
          <thead>
            <tr style={{ color: "#9ca3af" }}>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Amount</th>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Method</th>
              <th style={{ textAlign: "left", padding: "8px 4px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} style={{ borderTop: "1px solid #222" }}>
                <td style={{ padding: "8px 4px", textAlign: "left" }}>
                  {p.date}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "left" }}>
                  {p.amount}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "left" }}>
                  {p.method}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "left" }}>
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Pricing;
