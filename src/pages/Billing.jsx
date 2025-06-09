import React, { useState } from "react";

function Billing() {
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

  const cardStyle = {
    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    cursor: "pointer",
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
          Billing & Subscription
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.125rem" }}>
          Manage your payment methods and subscription.
        </p>
      </div>

      {/* Update Credit Card Section */}
      <div
        style={{
          ...cardStyle,
          maxWidth: "100%",
          cursor: "default",
          marginBottom: "40px",
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

      {/* Subscription Management Section */}
      <div
        style={{
          ...cardStyle,
          maxWidth: "100%",
          cursor: "default",
          marginBottom: "40px",
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
                color: subscriptionStatus === "Active" ? "#4ade80" : "#f87171",
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

export default Billing;
