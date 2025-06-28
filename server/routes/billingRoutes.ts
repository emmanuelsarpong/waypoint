import express, { Request, Response } from "express";
import {
  createCheckoutSession,
  createSetupIntent,
  ensureStripeCustomer,
  getDefaultPaymentMethod,
  setDefaultPaymentMethod,
  stripeWebhook,
} from "../controllers/billingController";
import { protect } from "../middleware/authMiddleware";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/create-setup-intent", protect, createSetupIntent);
router.get("/default-payment-method", protect, getDefaultPaymentMethod);
router.get("/ensure-customer", protect, ensureStripeCustomer);
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

export default router;
