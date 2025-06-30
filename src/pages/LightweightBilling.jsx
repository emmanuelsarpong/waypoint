import React, { useState, useCallback, useMemo } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { authFetch } from "../utils/authFetch";
import { useBillingData, usePaymentHistory } from "../hooks/useBilling";

// Lightweight spinner components
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center justify-center gap-2">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    <span className="text-gray-400">Loading...</span>
  </div>
));

const ButtonSpinner = React.memo(() => (
  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
));

// Memoized pagination component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex gap-2 items-center mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-600 text-white rounded disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-gray-500"
      >
        Previous
      </button>

      {getVisiblePages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-600 text-white hover:bg-gray-500"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-600 text-white rounded disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-gray-500"
      >
        Next
      </button>
    </div>
  );
});

// Memoized payment table
const PaymentTable = React.memo(({ payments, loading }) => {
  if (loading) return <LoadingSpinner />;
  if (payments.length === 0)
    return <p className="text-gray-400">No payment history found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-700">
              <td className="p-3">
                {new Date(payment.created * 1000).toLocaleDateString()}
              </td>
              <td className="p-3">
                ${(payment.amount_total / 100).toFixed(2)}
              </td>
              <td className="p-3">
                <span
                  className={`font-bold ${
                    payment.payment_status === "paid"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {payment.payment_status}
                </span>
              </td>
              <td className="p-3">
                {payment.line_items?.data?.[0]?.description || "Subscription"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

function LightweightBilling({ user }) {
  const [uiState, setUiState] = useState({
    cardMsg: "",
    loading: false,
    loadingPortal: false,
  });
  const [paymentFilters, setPaymentFilters] = useState({ month: "", year: "" });

  const stripe = useStripe();
  const elements = useElements();

  // Use custom hooks for data management
  const billingData = useBillingData(user);
  const paymentHistory = usePaymentHistory(user, paymentFilters);

  // Memoized computed values
  const isSubscribed = useMemo(() => {
    return (
      billingData.subscription.status === "active" ||
      billingData.subscription.status === "trialing"
    );
  }, [billingData.subscription.status]);

  const planName = useMemo(() => {
    if (!billingData.subscription.plan) return "No active plan";
    const planNames = {
      price_monthly: "Monthly Plan - $9.99/month",
      price_yearly: "Yearly Plan - $99.99/year",
    };
    return planNames[billingData.subscription.plan] || "Unknown Plan";
  }, [billingData.subscription.plan]);

  // Optimized handlers
  const handleCardUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setUiState((prev) => ({ ...prev, cardMsg: "", loading: true }));

      if (!stripe || !elements) {
        setUiState((prev) => ({
          ...prev,
          cardMsg: "Stripe is not loaded.",
          loading: false,
        }));
        return;
      }

      try {
        const res = await authFetch("/api/billing/create-setup-intent", {
          method: "POST",
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          const err = await res.json();
          setUiState((prev) => ({
            ...prev,
            cardMsg: err.error || "Failed to create setup intent.",
            loading: false,
          }));
          return;
        }

        const { clientSecret } = await res.json();
        const result = await stripe.confirmCardSetup(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (result.error) {
          setUiState((prev) => ({
            ...prev,
            cardMsg: result.error.message,
            loading: false,
          }));
        } else {
          setUiState((prev) => ({
            ...prev,
            cardMsg: "✅ Payment method updated successfully!",
            loading: false,
          }));
          billingData.fetchPaymentMethod();
        }
      } catch (err) {
        setUiState((prev) => ({
          ...prev,
          cardMsg: "An error occurred. Please try again.",
          loading: false,
        }));
      }
    },
    [stripe, elements, billingData]
  );

  const handleSubscribe = useCallback(async (priceId) => {
    setUiState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await authFetch("/api/billing/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) {
        const err = await res.json();
        setUiState((prev) => ({
          ...prev,
          cardMsg: err.error || "Failed to create checkout session.",
        }));
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setUiState((prev) => ({
        ...prev,
        cardMsg: "An error occurred. Please try again.",
      }));
    } finally {
      setUiState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setPaymentFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  return (
    <div className="p-5 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

      {/* Notification Message */}
      {uiState.cardMsg && (
        <div
          className={`p-4 mb-5 rounded-lg ${
            uiState.cardMsg.includes("✅")
              ? "bg-green-900 border border-green-400"
              : "bg-red-900 border border-red-400"
          }`}
        >
          {uiState.cardMsg}
        </div>
      )}

      {/* Subscription Status */}
      <div className="p-5 bg-gray-800 rounded-lg mb-8">
        <h2 className="text-xl mb-4">Subscription Status</h2>
        {billingData.loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`font-bold ${
                  isSubscribed ? "text-green-400" : "text-red-400"
                }`}
              >
                {billingData.subscription.status.charAt(0).toUpperCase() +
                  billingData.subscription.status.slice(1)}
              </span>
            </p>
            <p className="mb-2">
              <strong>Plan:</strong> {planName}
            </p>
            {isSubscribed && billingData.subscription.currentPeriodEnd && (
              <p>
                <strong>Next billing date:</strong>{" "}
                {new Date(
                  billingData.subscription.currentPeriodEnd * 1000
                ).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </div>

      {/* Subscription Plans */}
      {!isSubscribed && (
        <div className="p-5 bg-gray-800 rounded-lg mb-8">
          <h2 className="text-xl mb-5">Choose a Plan</h2>
          <div className="flex gap-5 flex-wrap">
            <div className="p-5 bg-gray-700 rounded-lg flex-1 min-w-[250px]">
              <h3 className="text-lg mb-3">Monthly Plan</h3>
              <p className="text-2xl font-bold text-green-400 mb-3">
                $9.99/month
              </p>
              <button
                onClick={() => handleSubscribe("price_monthly")}
                disabled={uiState.loading}
                className="flex items-center px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {uiState.loading && <ButtonSpinner />}
                Subscribe Monthly
              </button>
            </div>
            <div className="p-5 bg-gray-700 rounded-lg flex-1 min-w-[250px]">
              <h3 className="text-lg mb-3">Yearly Plan</h3>
              <p className="text-2xl font-bold text-green-400">$99.99/year</p>
              <p className="text-sm text-gray-400 mb-3">Save 2 months!</p>
              <button
                onClick={() => handleSubscribe("price_yearly")}
                disabled={uiState.loading}
                className="flex items-center px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {uiState.loading && <ButtonSpinner />}
                Subscribe Yearly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method */}
      <div className="p-5 bg-gray-800 rounded-lg mb-8">
        <h2 className="text-xl mb-4">Payment Method</h2>
        {billingData.savedCard ? (
          <p className="mb-5">
            <strong>Saved Card:</strong> •••• •••• ••••{" "}
            {billingData.savedCard.last4} (
            {billingData.savedCard.brand.toUpperCase()}) - Expires{" "}
            {billingData.savedCard.exp_month}/{billingData.savedCard.exp_year}
          </p>
        ) : (
          <p className="mb-5">No payment method saved.</p>
        )}

        <form onSubmit={handleCardUpdate}>
          <div className="p-3 bg-gray-700 rounded mb-4">
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
            disabled={!stripe || uiState.loading}
            className="flex items-center px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {uiState.loading && <ButtonSpinner />}
            Update Payment Method
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div className="p-5 bg-gray-800 rounded-lg">
        <h2 className="text-xl mb-5">Payment History</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-5 flex-wrap">
          <div>
            <label className="block mb-1">Month:</label>
            <select
              value={paymentFilters.month}
              onChange={(e) => handleFilterChange("month", e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded"
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
            <label className="block mb-1">Year:</label>
            <select
              value={paymentFilters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded"
            >
              <option value="">All</option>
              {paymentHistory.availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <PaymentTable
          payments={paymentHistory.payments}
          loading={paymentHistory.loading}
        />

        <Pagination
          currentPage={paymentHistory.currentPage}
          totalPages={paymentHistory.totalPages}
          onPageChange={paymentHistory.changePage}
        />

        {paymentHistory.payments.length > 0 && (
          <p className="mt-4 text-gray-400 text-sm">
            Showing {paymentHistory.payments.length} of{" "}
            {paymentHistory.totalCount} payments
          </p>
        )}
      </div>
    </div>
  );
}

export default React.memo(LightweightBilling);
