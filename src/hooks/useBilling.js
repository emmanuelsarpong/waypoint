import { useState, useEffect, useCallback } from "react";
import { authFetch } from "../utils/authFetch";

// Custom hook for billing data management
export function useBillingData(user) {
  const [data, setData] = useState({
    subscription: {
      status: "inactive",
      plan: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    },
    savedCard: null,
    loading: false,
    error: null,
  });

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) return;

    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      const res = await authFetch("/api/billing/subscription-status");
      if (res.ok) {
        const subscriptionData = await res.json();
        setData((prev) => ({
          ...prev,
          subscription: subscriptionData,
          loading: false,
        }));
      } else {
        throw new Error("Failed to fetch subscription status");
      }
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      setData((prev) => ({
        ...prev,
        error: err.message,
        loading: false,
      }));
    }
  }, [user]);

  const fetchPaymentMethod = useCallback(async () => {
    if (!user) return;

    try {
      const res = await authFetch("/api/billing/default-payment-method");
      if (res.ok) {
        const paymentData = await res.json();
        setData((prev) => ({
          ...prev,
          savedCard: paymentData.paymentMethod?.card || null,
        }));
      }
    } catch (err) {
      console.error("Error fetching payment method:", err);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchSubscriptionStatus(), fetchPaymentMethod()]);
  }, [fetchSubscriptionStatus, fetchPaymentMethod]);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  return {
    ...data,
    refreshData,
    fetchSubscriptionStatus,
    fetchPaymentMethod,
  };
}

// Custom hook for payment history with pagination
export function usePaymentHistory(user, filters = {}) {
  const [data, setData] = useState({
    payments: [],
    loading: true,
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    availableYears: [],
    error: null,
  });

  const fetchPayments = useCallback(
    async (page = 1, customFilters = {}) => {
      if (!user) return;

      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...customFilters,
        });

        const res = await authFetch(`/api/billing/payment-history?${params}`);
        if (res.ok) {
          const paymentData = await res.json();
          setData((prev) => ({
            ...prev,
            payments: paymentData.payments || [],
            totalPages: paymentData.totalPages || 1,
            totalCount: paymentData.totalCount || 0,
            availableYears: paymentData.availableYears || [],
            currentPage: page,
            loading: false,
          }));
        } else {
          throw new Error("Failed to fetch payment history");
        }
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setData((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    },
    [user]
  );

  const changePage = useCallback(
    (page) => {
      fetchPayments(page, filters);
    },
    [fetchPayments, filters]
  );

  const applyFilters = useCallback(
    (newFilters) => {
      fetchPayments(1, newFilters);
    },
    [fetchPayments]
  );

  useEffect(() => {
    if (user) {
      fetchPayments(data.currentPage, filters);
    }
  }, [user, filters, fetchPayments]); // Remove data.currentPage to prevent infinite loop

  return {
    ...data,
    changePage,
    applyFilters,
    refresh: () => fetchPayments(data.currentPage, filters),
  };
}
