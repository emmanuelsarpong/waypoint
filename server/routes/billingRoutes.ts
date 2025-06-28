import express, { Request, Response } from "express";
import {
  createCheckoutSession,
  createSetupIntent,
  ensureStripeCustomer,
  getDefaultPaymentMethod,
  getPaymentHistory,
  setDefaultPaymentMethod,
  stripeWebhook,
  createCustomerPortalSession,
  getSubscriptionStatus,
  webhookStatus,
} from "../controllers/billingController";
import { protect } from "../middleware/authMiddleware";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/create-setup-intent", protect, createSetupIntent);
router.get("/default-payment-method", protect, getDefaultPaymentMethod);
router.get("/ensure-customer", protect, ensureStripeCustomer);
router.get("/payment-history", protect, getPaymentHistory);
router.get("/subscription-status", protect, catchAsync(getSubscriptionStatus));
router.post(
  "/create-customer-portal",
  protect,
  catchAsync(createCustomerPortalSession)
);
router.post("/set-default-payment-method", protect, setDefaultPaymentMethod);
router.post(
  "/create-checkout-session",
  protect,
  catchAsync(createCheckoutSession)
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  catchAsync(stripeWebhook)
);
router.get("/webhook-status", webhookStatus);

export default router;
