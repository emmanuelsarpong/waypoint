import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { authFetch } from "../utils/authFetch";

function Billing({ user }) {
  const [cardMsg, setCardMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("Active");

  const payments = [
    { date: "2025-06-01", amount: "$10.00", method: "Visa", status: "Paid" },
    { date: "2025-05-01", amount: "$10.00", method: "Visa", status: "Paid" },
  ];

  const stripe = useStripe();
  const elements = useElements();
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleCardUpdate = async (e) => {
    e.preventDefault();
    setCardMsg("");
    setLoading(true);

    if (!stripe || !elements) {
      setCardMsg("Stripe is not loaded.");
      setLoading(false);
      return;
    }

    try {
      const res = await authFetch(
        `${backendUrl}/api/billing/create-setup-intent`,
        {
          method: "POST",
          body: JSON.stringify({ customerId: user.stripeCustomerId }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setCardMsg(err.error || "Failed to create setup intent.");
        setLoading(false);
        return;
      }

      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setCardMsg(result.error.message);
      } else {
        setCardMsg("Card updated successfully!");
      }
    } catch {
      setCardMsg("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const cardStyle = {
    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
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
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: "10px",
    opacity: loading ? 0.6 : 1,
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
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Billing & Subscription
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "1.125rem" }}>
          Manage your payment methods and subscription.
        </p>
      </div>

      <div
        style={{
          ...cardStyle,
          maxWidth: "100%",
          cursor: "default",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
        >
          Update Payment Method
        </h2>
        <form
          onSubmit={handleCardUpdate}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #3f3f3f",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": { color: "#9ca3af" },
                    fontFamily: "inherit",
                  },
                  invalid: { color: "#f87171" },
                },
              }}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={!stripe || loading}
          >
            {loading ? "Updating..." : "Update Card"}
          </button>
          {cardMsg && (
            <p
              style={{
                color: cardMsg.includes("success") ? "#4ade80" : "#f87171",
                marginTop: 8,
              }}
            >
              {cardMsg}
            </p>
          )}
        </form>
      </div>

      <div
        style={{
          ...cardStyle,
          maxWidth: "100%",
          cursor: "default",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}
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
              {subscriptionStatus}
            </span>
          </div>
          <button
            type="button"
            style={{
              ...buttonStyle,
              backgroundColor:
                subscriptionStatus === "Active" ? "#ff7eb3" : "#4ade80",
              color: "#111",
            }}
            onClick={() =>
              setSubscriptionStatus(
                subscriptionStatus === "Active" ? "Cancelled" : "Active"
              )
            }
          >
            {subscriptionStatus === "Active" ? "Cancel" : "Subscribe"}
          </button>
        </div>
      </div>

      <div
        style={{
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
                <td style={{ padding: "8px 4px" }}>{p.date}</td>
                <td style={{ padding: "8px 4px" }}>{p.amount}</td>
                <td style={{ padding: "8px 4px" }}>{p.method}</td>
                <td style={{ padding: "8px 4px" }}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;
