import React, {
  useEffect,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { authFetch } from "../utils/authFetch";

// Memoized spinner components
const TableSpinner = React.memo(() => {
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
});

const ButtonSpinner = React.memo(({ size = 16, color = "#fff" }) => (
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
));

// State reducer for complex state management
const initialState = {
  subscription: {
    status: "inactive",
    plan: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  },
  payments: {
    data: [],
    loading: true,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    filters: {
      month: "",
      year: "",
    },
    availableYears: [],
  },
  ui: {
    cardMsg: "",
    loading: false,
    loadingPortal: false,
    notificationTimer: null,
  },
  savedCard: null,
};

function billingReducer(state, action) {
  switch (action.type) {
    case "SET_SUBSCRIPTION":
      return {
        ...state,
        subscription: { ...state.subscription, ...action.payload },
      };
    case "SET_PAYMENTS":
      return {
        ...state,
        payments: { ...state.payments, ...action.payload },
      };
    case "SET_UI":
      return {
        ...state,
        ui: { ...state.ui, ...action.payload },
      };
    case "SET_SAVED_CARD":
      return {
        ...state,
        savedCard: action.payload,
      };
    case "SET_PAYMENT_FILTERS":
      return {
        ...state,
        payments: {
          ...state.payments,
          filters: { ...state.payments.filters, ...action.payload },
          currentPage: 1, // Reset to first page when filtering
        },
      };
    default:
      return state;
  }
}

// Optimized Billing component
function OptimizedBilling({ user }) {
  const [state, dispatch] = useReducer(billingReducer, initialState);
  const stripe = useStripe();
  const elements = useElements();

  const paymentsPerPage = 10;

  // Memoized API calls
  const fetchCard = useCallback(async () => {
    try {
      const res = await authFetch("/api/billing/default-payment-method");
      if (res.ok) {
        const data = await res.json();
        dispatch({
          type: "SET_SAVED_CARD",
          payload: data.paymentMethod?.card || null,
        });
      }
    } catch (err) {
      console.error("Error fetching payment method:", err);
    }
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const res = await authFetch("/api/billing/subscription-status");
      if (res.ok) {
        const data = await res.json();
        dispatch({ type: "SET_SUBSCRIPTION", payload: data });
      }
    } catch (err) {
      console.error("Error fetching subscription status:", err);
    }
  }, []);

  const fetchPaymentHistory = useCallback(async () => {
    try {
      dispatch({ type: "SET_PAYMENTS", payload: { loading: true } });

      const params = new URLSearchParams({
        page: state.payments.currentPage.toString(),
        limit: paymentsPerPage.toString(),
      });

      if (state.payments.filters.month) {
        params.append("month", state.payments.filters.month);
      }
      if (state.payments.filters.year) {
        params.append("year", state.payments.filters.year);
      }

      const res = await authFetch(`/api/billing/payment-history?${params}`);
      if (res.ok) {
        const data = await res.json();
        dispatch({
          type: "SET_PAYMENTS",
          payload: {
            data: data.payments || [],
            totalPages: data.totalPages || 1,
            totalCount: data.totalCount || 0,
            availableYears: data.availableYears || [],
            loading: false,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
      dispatch({ type: "SET_PAYMENTS", payload: { loading: false } });
    }
  }, [state.payments.currentPage, state.payments.filters, paymentsPerPage]);

  // Effects with proper dependencies
  useEffect(() => {
    if (user) {
      fetchCard();
    }
  }, [user, fetchCard]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user, fetchSubscriptionStatus]);

  useEffect(() => {
    if (user) {
      fetchPaymentHistory();
    }
  }, [user, fetchPaymentHistory]);

  // Handle URL parameters for success/cancel
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "1") {
      const emailSent = urlParams.get("email_sent") === "1";
      const message = emailSent
        ? "✅ Payment successful! A receipt has been sent to your email address."
        : "✅ Subscription successful! Welcome to your new plan!";

      dispatch({ type: "SET_UI", payload: { cardMsg: message } });
      window.history.replaceState({}, document.title, window.location.pathname);

      // Refresh data after successful payment
      setTimeout(() => {
        fetchSubscriptionStatus();
        fetchPaymentHistory();
      }, 2000);

      // Auto-clear message
      const timer = setTimeout(() => {
        dispatch({ type: "SET_UI", payload: { cardMsg: "" } });
      }, 10000);

      dispatch({ type: "SET_UI", payload: { notificationTimer: timer } });
    } else if (urlParams.get("canceled") === "1") {
      dispatch({
        type: "SET_UI",
        payload: {
          cardMsg: "❌ Subscription was canceled. You can try again anytime.",
        },
      });
      window.history.replaceState({}, document.title, window.location.pathname);

      const timer = setTimeout(() => {
        dispatch({ type: "SET_UI", payload: { cardMsg: "" } });
      }, 5000);

      dispatch({ type: "SET_UI", payload: { notificationTimer: timer } });
    }

    return () => {
      if (state.ui.notificationTimer) {
        clearTimeout(state.ui.notificationTimer);
      }
    };
  }, []); // Only run once on mount

  // Memoized handlers
  const handleCardUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      dispatch({ type: "SET_UI", payload: { cardMsg: "", loading: true } });

      if (!stripe || !elements) {
        dispatch({
          type: "SET_UI",
          payload: { cardMsg: "Stripe is not loaded.", loading: false },
        });
        return;
      }

      try {
        const res = await authFetch("/api/billing/create-setup-intent", {
          method: "POST",
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          const err = await res.json();
          dispatch({
            type: "SET_UI",
            payload: {
              cardMsg: err.error || "Failed to create setup intent.",
              loading: false,
            },
          });
          return;
        }

        const { clientSecret } = await res.json();
        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (result.error) {
          dispatch({
            type: "SET_UI",
            payload: { cardMsg: result.error.message, loading: false },
          });
        } else {
          dispatch({
            type: "SET_UI",
            payload: {
              cardMsg: "✅ Payment method updated successfully!",
              loading: false,
            },
          });
          await fetchCard(); // Refresh card data
        }
      } catch (err) {
        dispatch({
          type: "SET_UI",
          payload: {
            cardMsg: "An error occurred. Please try again.",
            loading: false,
          },
        });
      }
    },
    [stripe, elements, fetchCard]
  );

  const handleSubscribe = useCallback(async (priceId) => {
    dispatch({ type: "SET_UI", payload: { loading: true } });

    try {
      const res = await authFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const err = await res.json();
        dispatch({
          type: "SET_UI",
          payload: {
            cardMsg: err.error || "Failed to create checkout session.",
          },
        });
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      dispatch({
        type: "SET_UI",
        payload: { cardMsg: "An error occurred. Please try again." },
      });
    } finally {
      dispatch({ type: "SET_UI", payload: { loading: false } });
    }
  }, []);

  // Memoized filter handlers
  const handleFilterChange = useCallback((filterType, value) => {
    dispatch({
      type: "SET_PAYMENT_FILTERS",
      payload: { [filterType]: value },
    });
  }, []);

  const handlePageChange = useCallback((page) => {
    dispatch({
      type: "SET_PAYMENTS",
      payload: { currentPage: page },
    });
  }, []);

  // Memoized computed values
  const isSubscribed = useMemo(() => {
    return (
      state.subscription.status === "active" ||
      state.subscription.status === "trialing"
    );
  }, [state.subscription.status]);

  const planName = useMemo(() => {
    if (!state.subscription.plan) return "No active plan";
    const planNames = {
      price_monthly: "Monthly Plan - $9.99/month",
      price_yearly: "Yearly Plan - $99.99/year",
    };
    return planNames[state.subscription.plan] || "Unknown Plan";
  }, [state.subscription.plan]);

  // Memoized pagination component
  const Pagination = useMemo(() => {
    if (state.payments.totalPages <= 1) return null;

    const maxVisiblePages = 5;
    const currentPage = state.payments.currentPage;
    const totalPages = state.payments.totalPages;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            backgroundColor: currentPage === 1 ? "#374151" : "#4B5563",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: "8px 12px",
                backgroundColor: page === currentPage ? "#3B82F6" : "#4B5563",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() =>
            handlePageChange(Math.min(totalPages, currentPage + 1))
          }
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            backgroundColor: currentPage === totalPages ? "#374151" : "#4B5563",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    );
  }, [state.payments.currentPage, state.payments.totalPages, handlePageChange]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#111827",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "30px" }}
      >
        Billing & Subscription
      </h1>

      {/* Notification Message */}
      {state.ui.cardMsg && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: state.ui.cardMsg.includes("✅")
              ? "#065F46"
              : "#991B1B",
            border: `1px solid ${
              state.ui.cardMsg.includes("✅") ? "#10B981" : "#EF4444"
            }`,
          }}
        >
          {state.ui.cardMsg}
        </div>
      )}

      {/* Subscription Status */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#1F2937",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
          Subscription Status
        </h2>
        <p>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: isSubscribed ? "#10B981" : "#EF4444",
              fontWeight: "bold",
            }}
          >
            {state.subscription.status.charAt(0).toUpperCase() +
              state.subscription.status.slice(1)}
          </span>
        </p>
        <p>
          <strong>Plan:</strong> {planName}
        </p>
        {isSubscribed && state.subscription.currentPeriodEnd && (
          <p>
            <strong>Next billing date:</strong>{" "}
            {new Date(
              state.subscription.currentPeriodEnd * 1000
            ).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Subscription Plans */}
      {!isSubscribed && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#1F2937",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
            Choose a Plan
          </h2>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#374151",
                borderRadius: "8px",
                flex: "1",
                minWidth: "250px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                Monthly Plan
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#10B981",
                }}
              >
                $9.99/month
              </p>
              <button
                onClick={() => handleSubscribe("price_monthly")}
                disabled={state.ui.loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: state.ui.loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {state.ui.loading && <ButtonSpinner />}
                Subscribe Monthly
              </button>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#374151",
                borderRadius: "8px",
                flex: "1",
                minWidth: "250px",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>
                Yearly Plan
              </h3>
              <p
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#10B981",
                }}
              >
                $99.99/year
              </p>
              <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
                Save 2 months!
              </p>
              <button
                onClick={() => handleSubscribe("price_yearly")}
                disabled={state.ui.loading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#10B981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: state.ui.loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {state.ui.loading && <ButtonSpinner />}
                Subscribe Yearly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#1F2937",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>
          Payment Method
        </h2>
        {state.savedCard ? (
          <p>
            <strong>Saved Card:</strong> •••• •••• •••• {state.savedCard.last4}{" "}
            ({state.savedCard.brand.toUpperCase()}) - Expires{" "}
            {state.savedCard.exp_month}/{state.savedCard.exp_year}
          </p>
        ) : (
          <p>No payment method saved.</p>
        )}

        <form onSubmit={handleCardUpdate} style={{ marginTop: "20px" }}>
          <div
            style={{
              padding: "10px",
              backgroundColor: "#374151",
              borderRadius: "4px",
              marginBottom: "15px",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#fff",
                    "::placeholder": { color: "#9CA3AF" },
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!stripe || state.ui.loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3B82F6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: !stripe || state.ui.loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {state.ui.loading && <ButtonSpinner />}
            Update Payment Method
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#1F2937",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Payment History
        </h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Month:
            </label>
            <select
              value={state.payments.filters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              style={{
                padding: "8px",
                backgroundColor: "#374151",
                color: "#fff",
                border: "1px solid #4B5563",
                borderRadius: "4px",
              }}
            >
              <option value="">All</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Year:
            </label>
            <select
              value={state.payments.filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              style={{
                padding: "8px",
                backgroundColor: "#374151",
                color: "#fff",
                border: "1px solid #4B5563",
                borderRadius: "4px",
              }}
            >
              <option value="">All</option>
              {state.payments.availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {state.payments.loading ? (
          <TableSpinner />
        ) : state.payments.data.length === 0 ? (
          <p style={{ color: "#9CA3AF" }}>No payment history found.</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #4B5563" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Amount
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.payments.data.map((payment) => (
                    <tr
                      key={payment.id}
                      style={{ borderBottom: "1px solid #374151" }}
                    >
                      <td style={{ padding: "12px" }}>
                        {new Date(payment.created * 1000).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "12px" }}>
                        ${(payment.amount_total / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            color:
                              payment.payment_status === "paid"
                                ? "#10B981"
                                : "#EF4444",
                            fontWeight: "bold",
                          }}
                        >
                          {payment.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {payment.line_items?.data?.[0]?.description ||
                          "Subscription"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {Pagination}
            <p
              style={{
                marginTop: "15px",
                color: "#9CA3AF",
                fontSize: "0.875rem",
              }}
            >
              Showing {state.payments.data.length} of{" "}
              {state.payments.totalCount} payments
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(OptimizedBilling);
