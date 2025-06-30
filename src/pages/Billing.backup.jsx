import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { authFetch } from "../utils/authFetch";

// Small inline spinner component
const TableSpinner = () => {
  // Insert styles into document head if not already present
  React.useEffect(() => {
    if (!document.getElementById("table-spinner-styles")) {
      const style = document.createElement("style");
      style.id = "table-spinner-styles";
      style.textContent = `
        @keyframes tableSpinner {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          animation: "tableSpinner 1s linear infinite",
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="15.708"
          strokeDashoffset="15.708"
        />
      </svg>
      <span style={{ color: "#9ca3af" }}>Loading payment history...</span>
    </div>
  );
};

// Small button spinner component
const ButtonSpinner = ({ size = 16, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{
      animation: "tableSpinner 1s linear infinite",
      marginRight: "8px",
    }}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="15.708"
      strokeDashoffset="15.708"
    />
  </svg>
);
function Billing({ user }) {
  const [cardMsg, setCardMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    status: "inactive",
    plan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
  const [savedCard, setSavedCard] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [notificationTimer, setNotificationTimer] = useState(null);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const paymentsPerPage = 10;

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    async function fetchCard() {
      try {
        const res = await authFetch("/api/billing/default-payment-method");
        if (res.ok) {
          const data = await res.json();
          setSavedCard(data.paymentMethod?.card || null);
        }
      } catch (err) {
        console.error("Error fetching payment method:", err);
      }
    }
    fetchCard();
  }, [user]);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
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
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  useEffect(() => {
    async function fetchPaymentHistory() {
      try {
        setLoadingPayments(true);

        // Build query parameters for pagination and filtering
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: paymentsPerPage.toString(),
        });

        if (selectedMonth) params.append("month", selectedMonth);
        if (selectedYear) params.append("year", selectedYear);

        const res = await authFetch(`/api/billing/payment-history?${params}`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments || []);
          setTotalPages(data.totalPages || 1);
          setTotalPayments(data.totalCount || 0);

          // Extract available years from the response
          if (data.availableYears && data.availableYears.length > 0) {
            setAvailableYears(data.availableYears);
          }
        }
      } catch (err) {
        console.error("Error fetching payment history:", err);
      } finally {
        setLoadingPayments(false);
      }
    }
    if (user) {
      fetchPaymentHistory();
    }
  }, [user, currentPage, selectedMonth, selectedYear, paymentsPerPage]);

  // Check for success/cancel query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "1") {
      const emailSent = urlParams.get("email_sent") === "1";
      if (emailSent) {
        setCardMsg(
          "✅ Payment successful! A receipt has been sent to your email address."
        );
      } else {
        setCardMsg("✅ Subscription successful! Welcome to your new plan!");
      }
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);

      // Refresh subscription status and payment history after successful payment
      setTimeout(() => {
        refreshSubscriptionData();
        refreshPaymentHistory();
      }, 2000); // Wait 2 seconds to let webhook processing complete

      // Auto-clear success message after 10 seconds
      const timer = setTimeout(() => {
        setCardMsg("");
      }, 10000);
      setNotificationTimer(timer);
    } else if (urlParams.get("canceled") === "1") {
      setCardMsg("❌ Subscription was canceled. You can try again anytime.");
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);

      // Auto-clear cancel message after 5 seconds
      const timer = setTimeout(() => {
        setCardMsg("");
      }, 5000);
      setNotificationTimer(timer);
    }

    // Cleanup timer on unmount
    return () => {
      if (notificationTimer) {
        clearTimeout(notificationTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
      const res = await authFetch("/api/billing/create-setup-intent", {
        method: "POST",
        body: JSON.stringify({}),
      });

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
        // Set as default in backend
        await authFetch("/api/billing/set-default-payment-method", {
          method: "POST",
          body: JSON.stringify({
            paymentMethodId: result.setupIntent.payment_method,
          }),
        });
        setCardMsg("Card updated successfully!");
        // Optionally refetch card info here
      }
    } catch (err) {
      setCardMsg("An error occurred. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleOpenCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const res = await authFetch("/api/billing/create-customer-portal", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url; // Redirect to Stripe Customer Portal
      } else {
        const errorData = await res.json();
        if (errorData.supportAction) {
          setCardMsg(
            "Billing portal is not yet configured. Please contact support to manage your subscription."
          );
        } else {
          setCardMsg(errorData.error || "Failed to open billing portal");
        }
      }
    } catch (err) {
      console.error("Error opening customer portal:", err);
      setCardMsg("Failed to open billing portal. Please try again.");
    } finally {
      setLoadingPortal(false);
    }
  };

  // Function to refresh subscription status and payment history
  const refreshSubscriptionData = async () => {
    try {
      const res = await authFetch("/api/billing/subscription-status");
      if (res.ok) {
        const data = await res.json();
        setSubscriptionData(data);
      }
    } catch (err) {
      console.error("Error refreshing subscription status:", err);
    }
  };

  const refreshPaymentHistory = async () => {
    try {
      setLoadingPayments(true);

      // Build query parameters for pagination and filtering
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: paymentsPerPage.toString(),
      });

      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);

      const res = await authFetch(`/api/billing/payment-history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        setTotalPages(data.totalPages || 1);
        setTotalPayments(data.totalCount || 0);

        // Extract available years from the response
        if (data.availableYears && data.availableYears.length > 0) {
          setAvailableYears(data.availableYears);
        }
      }
    } catch (err) {
      console.error("Error refreshing payment history:", err);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Periodic refresh of subscription status (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      refreshSubscriptionData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Filter and pagination handlers
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Month options
  const monthOptions = [
    { value: "", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

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
        textAlign: "left",
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

      {/* Success/Error Notification */}
      {cardMsg && (
        <div
          style={{
            ...cardStyle,
            maxWidth: "100%",
            cursor: "default",
            marginBottom: "40px",
            backgroundColor:
              cardMsg.includes("successful") || cardMsg.includes("✅")
                ? "linear-gradient(145deg, #064e3b, #022c22)"
                : "linear-gradient(145deg, #7f1d1d, #450a0a)",
            borderColor:
              cardMsg.includes("successful") || cardMsg.includes("✅")
                ? "#059669"
                : "#dc2626",
            position: "relative",
          }}
        >
          <button
            onClick={() => {
              setCardMsg("");
              if (notificationTimer) {
                clearTimeout(notificationTimer);
                setNotificationTimer(null);
              }
            }}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              background: "none",
              border: "none",
              color: "#9ca3af",
              fontSize: "1.2rem",
              cursor: "pointer",
              padding: "5px",
              lineHeight: 1,
            }}
            title="Close notification"
          >
            ✕
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginRight: "40px",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>
              {cardMsg.includes("successful") || cardMsg.includes("✅")
                ? "📧"
                : "❌"}
            </span>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color:
                    cardMsg.includes("successful") || cardMsg.includes("✅")
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {cardMsg}
              </p>
              {cardMsg.includes("receipt has been sent") && (
                <p
                  style={{
                    margin: "8px 0 0 0",
                    fontSize: "0.9rem",
                    color: "#6ee7b7",
                  }}
                >
                  Check your inbox for the payment receipt and subscription
                  details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
        {savedCard && (
          <div style={{ marginBottom: 12, color: "#9ca3af" }}>
            Saved card: {savedCard.brand?.toUpperCase()} **** **** ****{" "}
            {savedCard.last4}
          </div>
        )}
        {!savedCard && (
          <div style={{ marginBottom: 12, color: "#9ca3af" }}>
            No card on file.
          </div>
        )}
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
            {loading && <ButtonSpinner />}
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
                color:
                  subscriptionData.status === "active" ? "#4ade80" : "#9ca3af",
              }}
            >
              {subscriptionData.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          {subscriptionData.plan && (
            <div>
              Plan:{" "}
              <span style={{ color: "#4ade80" }}>{subscriptionData.plan}</span>
            </div>
          )}
          {subscriptionData.currentPeriodEnd && (
            <div>
              Next billing date:{" "}
              <span style={{ color: "#9ca3af" }}>
                {new Date(
                  subscriptionData.currentPeriodEnd
                ).toLocaleDateString()}
              </span>
            </div>
          )}
          {subscriptionData.cancelAtPeriodEnd && (
            <div style={{ color: "#f87171", fontWeight: "bold" }}>
              ⚠️ Subscription will cancel at the end of the current period
            </div>
          )}
          {subscriptionData.status === "active" ? (
            <button
              type="button"
              style={{
                ...buttonStyle,
                backgroundColor: "#3b82f6",
                color: "#fff",
              }}
              onClick={handleOpenCustomerPortal}
              disabled={loadingPortal}
            >
              {loadingPortal && <ButtonSpinner />}
              {loadingPortal ? "Loading..." : "Manage Subscription"}
            </button>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <p
                style={{
                  color: "#9ca3af",
                  marginBottom: "10px",
                  fontSize: "0.9rem",
                }}
              >
                Subscribe to a plan to unlock premium features
              </p>
              <button
                type="button"
                style={{
                  ...buttonStyle,
                  backgroundColor: "#4ade80",
                  color: "#111",
                }}
                onClick={() => (window.location.href = "/pricing")}
              >
                View Plans
              </button>
            </div>
          )}
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

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "25px",
            alignItems: "end", // Changed to align all items to bottom
          }}
        >
          {/* Month Filter */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              minWidth: "120px",
            }}
          >
            <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
              Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid #3f3f3f",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.9rem",
                width: "100%",
              }}
            >
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              minWidth: "100px",
            }}
          >
            <label style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
              Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              style={{
                backgroundColor: "#1a1a1a",
                color: "#fff",
                border: "1px solid #3f3f3f",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.9rem",
                width: "100%",
              }}
            >
              <option value="">All Years</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedMonth || selectedYear) && (
            <button
              onClick={clearFilters}
              style={{
                backgroundColor: "#374151",
                color: "#fff",
                border: "1px solid #4b5563",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.9rem",
                cursor: "pointer",
                height: "fit-content",
                whiteSpace: "nowrap",
              }}
            >
              Clear Filters
            </button>
          )}

          {/* Results Summary */}
          <div
            style={{
              marginLeft: "auto",
              fontSize: "0.9rem",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              height: "fit-content",
            }}
          >
            {totalPayments > 0 && (
              <>
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * paymentsPerPage + 1,
                  totalPayments
                )}
                -{Math.min(currentPage * paymentsPerPage, totalPayments)} of{" "}
                {totalPayments} payments
              </>
            )}
          </div>
        </div>

        {/* Responsive Table Container */}
        <div style={{ overflowX: "auto", marginBottom: "20px" }}>
          <table
            style={{
              width: "100%",
              color: "#fff",
              borderCollapse: "collapse",
              fontSize: "1rem",
              minWidth: "600px", // Ensure table doesn't get too small on mobile
            }}
          >
            <thead>
              <tr style={{ color: "#9ca3af" }}>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Date & Time
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Amount
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Description
                </th>
                <th style={{ textAlign: "left", padding: "8px 4px" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loadingPayments ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: "24px 4px", textAlign: "center" }}
                  >
                    <TableSpinner />
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: "16px 4px", textAlign: "center" }}
                  >
                    {selectedMonth || selectedYear
                      ? "No payments found for the selected period."
                      : "No payments found."}
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <tr key={p.id || i} style={{ borderTop: "1px solid #222" }}>
                    <td style={{ padding: "8px 4px" }}>
                      <div>{p.date}</div>
                      {p.time && (
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                          {p.time}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "8px 4px", fontWeight: "bold" }}>
                      {p.amount}
                      {p.currency && p.currency !== "USD" && (
                        <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                          {" " + p.currency}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "8px 4px" }}>
                      <div>{p.description || p.type}</div>
                      {p.invoiceNumber && (
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                          Invoice: {p.invoiceNumber}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "8px 4px" }}>
                      <span
                        style={{
                          color: p.status === "Paid" ? "#4ade80" : "#f87171",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          backgroundColor:
                            p.status === "Paid"
                              ? "rgba(74, 222, 128, 0.1)"
                              : "rgba(248, 113, 113, 0.1)",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "25px",
              flexWrap: "wrap",
            }}
          >
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? "#374151" : "#1a1a1a",
                color: currentPage === 1 ? "#6b7280" : "#fff",
                border: "1px solid #3f3f3f",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.9rem",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  backgroundColor: page === currentPage ? "#3b82f6" : "#1a1a1a",
                  color: "#fff",
                  border: "1px solid #3f3f3f",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  minWidth: "40px",
                }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor:
                  currentPage === totalPages ? "#374151" : "#1a1a1a",
                color: currentPage === totalPages ? "#6b7280" : "#fff",
                border: "1px solid #3f3f3f",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "0.9rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Billing;
