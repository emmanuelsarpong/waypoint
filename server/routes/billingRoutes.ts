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

// Manual trigger for subscription completion (for local development)
router.post("/trigger-email", protect, async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer found" });
      return;
    }

    // Import the email function
    const { sendPaymentConfirmationEmail } = await import(
      "../services/emailService"
    );

    // Send a test confirmation email
    try {
      await sendPaymentConfirmationEmail(
        user.email,
        "$7.00 CAD",
        "Pro Plan",
        new Date().toLocaleDateString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days from now
        true
      );

      console.log(`✅ Test confirmation email sent to: ${user.email}`);
      res.json({
        message: "Test confirmation email sent successfully!",
        emailSent: true,
        recipient: user.email,
      });
    } catch (emailError) {
      console.error("❌ Failed to send test email:", emailError);
      res.status(500).json({
        error: "Failed to send test email",
        details:
          emailError instanceof Error ? emailError.message : String(emailError),
      });
    }
  } catch (err) {
    console.error("Error triggering email:", err);
    res.status(500).json({ error: "Failed to trigger email" });
  }
});

// Debug endpoint to view subscription details (for cleanup)
router.get(
  "/debug-subscriptions",
  protect,
  async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user?.stripeCustomerId) {
        res.status(400).json({ error: "No Stripe customer found" });
        return;
      }

      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 20,
      });

      const subscriptionDetails = subscriptions.data.map((sub: any) => ({
        id: sub.id,
        status: sub.status,
        created: new Date(sub.created * 1000).toLocaleString(),
        priceId: sub.items.data[0]?.price.id,
        amount: sub.items.data[0]?.price.unit_amount / 100,
        plan:
          sub.items.data[0]?.price.unit_amount === 700
            ? "Pro"
            : sub.items.data[0]?.price.unit_amount === 2500
            ? "Team"
            : "Unknown",
        current_period_start: new Date(
          sub.current_period_start * 1000
        ).toLocaleString(),
        current_period_end: new Date(
          sub.current_period_end * 1000
        ).toLocaleString(),
      }));

      res.json({
        total: subscriptions.data.length,
        subscriptions: subscriptionDetails,
        note: "You have multiple active subscriptions. Consider canceling old ones to avoid multiple charges.",
      });
    } catch (err) {
      console.error("Error fetching subscription details:", err);
      res.status(500).json({ error: "Failed to fetch subscription details" });
    }
  }
);

export default router;
