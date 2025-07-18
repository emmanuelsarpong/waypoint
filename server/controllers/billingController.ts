import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/userModel"; // adjust path as needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export const createSetupIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let customerId = (req.user as any)?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email,
        metadata: { userId: req.user!._id.toString() },
      });

      // Update user with new customer ID
      req.user!.stripeCustomerId = customer.id;
      await req.user!.save();

      customerId = customer.id;
    }

    // Try to create setup intent, create new customer if the provided one doesn't exist
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      });
      res.json({ clientSecret: setupIntent.client_secret });
    } catch (err: any) {
      // If customer doesn't exist, create a new one
      if (err.code === "resource_missing") {
        console.log(
          `Customer ${customerId} not found, creating new customer...`
        );
        const customer = await stripe.customers.create({
          email: req.user!.email,
          metadata: { userId: req.user!._id.toString() },
        });

        // Update user with new customer ID
        req.user!.stripeCustomerId = customer.id;
        await req.user!.save();

        // Create setup intent with new customer
        const setupIntent = await stripe.setupIntents.create({
          customer: customer.id,
        });
        res.json({ clientSecret: setupIntent.client_secret });
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error("Error creating setup intent:", error);
    res.status(500).json({ error: "Failed to create setup intent" });
  }
};

export const getDefaultPaymentMethod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let customerId = (req.user as any)?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      console.log("No customer ID found, creating new customer...");
      const customer = await stripe.customers.create({
        email: req.user!.email,
        metadata: { userId: req.user!._id.toString() },
      });

      // Update user with new customer ID
      req.user!.stripeCustomerId = customer.id;
      await req.user!.save();

      customerId = customer.id;
      // New customer won't have a default payment method
      res.json({ paymentMethod: null });
      return;
    }

    // Try to retrieve the customer, create a new one if it doesn't exist
    let customer;
    try {
      customer = await stripe.customers.retrieve(customerId, {
        expand: ["invoice_settings.default_payment_method"],
      });
    } catch (err: any) {
      // If customer doesn't exist, create a new one
      if (err.code === "resource_missing") {
        console.log(
          `Customer ${customerId} not found, creating new customer...`
        );
        customer = await stripe.customers.create({
          email: req.user!.email,
          metadata: { userId: req.user!._id.toString() },
        });

        // Update user with new customer ID
        req.user!.stripeCustomerId = customer.id;
        await req.user!.save();

        // New customer won't have a default payment method
        res.json({ paymentMethod: null });
        return;
      }
      throw err;
    }

    const paymentMethod = (customer as any).invoice_settings
      .default_payment_method;
    res.json({ paymentMethod });
  } catch (err) {
    console.error("Error fetching default payment method:", err);
    res.status(500).json({ error: "Failed to fetch payment method." });
  }
};

export const confirmCardSetup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { clientSecret, paymentMethodId } = req.body;
    if (!clientSecret || !paymentMethodId) {
      res
        .status(400)
        .json({ error: "Missing clientSecret or paymentMethodId" });
      return;
    }

    if (!(req.user as any)?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer ID found for user" });
      return;
    }

    const customerId = req.user!.stripeCustomerId;

    const setupIntent = await stripe.setupIntents.confirm(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (setupIntent.status !== "succeeded") {
      res
        .status(500)
        .json({ error: `SetupIntent status: ${setupIntent.status}` });
      return;
    }

    // Set as default payment method directly
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    res.json({ message: "Card updated successfully!" });
  } catch (error) {
    console.error("Error in confirmCardSetup:", error);
    res.status(500).json({ error: "Failed to confirm card setup" });
  }
};

export const setDefaultPaymentMethod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { paymentMethodId } = req.body;

    if (!paymentMethodId) {
      res.status(400).json({ error: "Missing paymentMethodId" });
      return;
    }

    if (!(req.user as any)?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer ID found for user" });
      return;
    }

    const customerId = req.user!.stripeCustomerId;

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    // Set as default
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("Error setting default payment method:", err);
    res.status(500).json({ error: "Failed to set default payment method." });
  }
};

export const createCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { priceId } = req.body;
    console.log("Received priceId:", priceId);
    const user = req.user;
    console.log("User from req.user:", user);

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (!priceId) {
      res.status(400).json({ error: "Missing priceId" });
      return;
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Check for existing active subscriptions
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    console.log(
      `Found ${existingSubscriptions.data.length} existing active subscriptions`
    );

    // If there are existing subscriptions, cancel them first
    if (existingSubscriptions.data.length > 0) {
      console.log(
        "Canceling existing subscriptions before creating new one..."
      );
      for (const subscription of existingSubscriptions.data) {
        await stripe.subscriptions.cancel(subscription.id);
        console.log(`Canceled subscription: ${subscription.id}`);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://waypoint-lemon.vercel.app/billing?success=1&email_sent=1`,
      cancel_url: `https://waypoint-lemon.vercel.app/billing?canceled=1`,
      metadata: { userId: user._id.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error in createCheckoutSession:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const ensureStripeCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let customerId = (req.user as any)?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user!.email,
        metadata: { userId: req.user!._id.toString() },
      });

      // Update user with new customer ID
      req.user!.stripeCustomerId = customer.id;
      await req.user!.save();

      customerId = customer.id;
    }

    res.json({ customerId });
  } catch (err) {
    console.error("Error ensuring Stripe customer:", err);
    res.status(500).json({ error: "Failed to ensure Stripe customer." });
  }
};

export const stripeWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(`🎯 Webhook called at ${new Date().toISOString()}`);
    console.log(
      `📋 Headers:`,
      req.headers["stripe-signature"]
        ? "Stripe signature present"
        : "No Stripe signature"
    );
    console.log(`📋 Body received:`, JSON.stringify(req.body, null, 2));

    const sig = req.headers["stripe-signature"];
    let event;

    if (sig) {
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig!,
          process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log(`✅ Signature verification passed`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(
          "❌ Webhook signature verification failed:",
          errorMessage
        );
        res.status(400).send(`Webhook Error: ${errorMessage}`);
        return;
      }
    } else {
      console.log("❌ No Stripe signature provided");
      res.status(400).send("Webhook Error: No signature provided");
      return;
    }

    console.log(`✅ Processing webhook event: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      console.log(`Checkout session completed for user: ${userId}`);
      console.log("Session data:", JSON.stringify(session, null, 2));

      if (userId) {
        // Update user subscription status - Stripe handles all emails
        const user = await User.findByIdAndUpdate(
          userId,
          { subscriptionStatus: "active" },
          { new: true }
        );

        console.log(
          `✅ User subscription status updated to active:`,
          user ? user.email : "No user found"
        );
        console.log(
          `📧 Payment confirmation email handled by Stripe automatically`
        );
      } else {
        console.log("No userId found in session metadata");
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      console.log(`Subscription deleted for user: ${userId}`);

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: "canceled",
        });
        console.log(`✅ User subscription status updated to canceled`);
        console.log(`📧 Cancellation email handled by Stripe automatically`);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      const customerId = subscription.customer;
      console.log(
        `Subscription updated for user: ${userId}, customer: ${customerId}`
      );
      console.log("Subscription data:", JSON.stringify(subscription, null, 2));

      // Find user by either userId or Stripe customer ID
      let user = null;
      if (userId) {
        user = await User.findById(userId);
      } else if (customerId) {
        user = await User.findOne({ stripeCustomerId: customerId });
      }

      if (user) {
        // Update subscription status if needed
        const newStatus =
          subscription.status === "active" ? "active" : subscription.status;
        if (user.subscriptionStatus !== newStatus) {
          await User.findByIdAndUpdate(user._id, {
            subscriptionStatus: newStatus,
          });
          console.log(
            `✅ User subscription status updated to ${newStatus}: ${user.email}`
          );
        }
        console.log(`📧 Plan change email handled by Stripe automatically`);
      } else {
        console.log("No user found for subscription update");
      }
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as any;
      const customerId = invoice.customer;
      console.log(`Invoice payment succeeded for customer: ${customerId}`);

      // Find user by Stripe customer ID and update status if needed
      const user = await User.findOne({ stripeCustomerId: customerId });

      if (user) {
        // Ensure user status is active for successful recurring payments
        if (user.subscriptionStatus !== "active") {
          await User.findByIdAndUpdate(user._id, {
            subscriptionStatus: "active",
          });
          console.log(
            `✅ User subscription status updated to active: ${user.email}`
          );
        }
        console.log(
          `📧 Recurring payment receipt handled by Stripe automatically`
        );
      }
    }

    res.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Webhook error:", errorMessage);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
  }
};

export const getPaymentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user?.stripeCustomerId) {
      res.json({
        payments: [],
        totalCount: 0,
        totalPages: 1,
        currentPage: 1,
        availableYears: [],
      });
      return;
    }

    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const selectedMonth = (req.query.month as string) || "";
    const selectedYear = (req.query.year as string) || "";

    console.log(
      "Fetching payment history for customer:",
      user.stripeCustomerId,
      { page, limit, selectedMonth, selectedYear }
    );

    // Get both checkout sessions and invoices for complete payment history
    // Fetch more data to handle filtering locally (Stripe doesn't support date filtering on these endpoints)
    const [checkoutSessions, invoices] = await Promise.all([
      stripe.checkout.sessions.list({
        customer: user.stripeCustomerId,
        limit: 100, // Fetch more to handle filtering
      }),
      stripe.invoices.list({
        customer: user.stripeCustomerId,
        limit: 100, // Fetch more to handle filtering
        status: "paid",
      }),
    ]);

    console.log("Checkout sessions found:", checkoutSessions.data.length);
    console.log("Paid invoices found:", invoices.data.length);

    const allPayments = [];
    const availableYears = new Set<string>();

    // Process checkout sessions (initial subscription purchases)
    for (const session of checkoutSessions.data) {
      if (session.status === "complete" && session.amount_total) {
        const createdDate = new Date(session.created * 1000);
        const year = createdDate.getFullYear().toString();
        const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");

        availableYears.add(year);

        // Apply date filtering
        if (selectedYear && year !== selectedYear) continue;
        if (selectedMonth && month !== selectedMonth) continue;

        // Determine plan name based on amount
        const amount = session.amount_total / 100;
        let planName = "Subscription";
        if (amount === 7) {
          planName = "Pro Plan";
        } else if (amount === 25) {
          planName = "Team Plan";
        }

        allPayments.push({
          id: session.id,
          date: createdDate.toISOString().split("T")[0],
          time: createdDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          datetime: createdDate.toISOString(),
          amount: `$${amount.toFixed(2)}`,
          currency: session.currency?.toUpperCase() || "CAD",
          method: "Card",
          status: "Paid",
          type:
            session.mode === "subscription"
              ? "Subscription"
              : "One-time Payment",
          description:
            session.mode === "subscription"
              ? `${planName} - Initial Subscription`
              : "One-time Purchase",
          transactionId: session.id,
          source: "checkout_session",
        });
      }
    }

    // Process invoices (recurring payments, subscription changes)
    for (const invoice of invoices.data) {
      if (invoice.status === "paid" && invoice.amount_paid > 0) {
        const createdDate = new Date(invoice.created * 1000);
        const year = createdDate.getFullYear().toString();
        const month = (createdDate.getMonth() + 1).toString().padStart(2, "0");

        availableYears.add(year);

        // Apply date filtering
        if (selectedYear && year !== selectedYear) continue;
        if (selectedMonth && month !== selectedMonth) continue;

        // Determine plan name based on amount
        const amount = invoice.amount_paid / 100;
        let planName = "Subscription";
        if (amount === 7) {
          planName = "Pro Plan";
        } else if (amount === 25) {
          planName = "Team Plan";
        }

        // Check if this is a recurring payment or proration
        let description = `${planName} - Recurring Payment`;
        if (invoice.billing_reason === "subscription_create") {
          description = `${planName} - Initial Payment`;
        } else if (invoice.billing_reason === "subscription_update") {
          description = `${planName} - Plan Change`;
        } else if (invoice.billing_reason === "subscription_cycle") {
          description = `${planName} - Monthly Renewal`;
        }

        // Avoid duplicates by checking if we already have a checkout session for the same time
        const isDuplicate = allPayments.some(
          (p) =>
            Math.abs(new Date(p.datetime).getTime() - createdDate.getTime()) <
              60000 && // Within 1 minute
            p.amount === `$${amount.toFixed(2)}`
        );

        if (!isDuplicate) {
          allPayments.push({
            id: invoice.id,
            date: createdDate.toISOString().split("T")[0],
            time: createdDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            datetime: createdDate.toISOString(),
            amount: `$${amount.toFixed(2)}`,
            currency: invoice.currency?.toUpperCase() || "CAD",
            method: "Card",
            status: "Paid",
            type: "Subscription",
            description,
            transactionId: invoice.id,
            source: "invoice",
            invoiceNumber: invoice.number,
          });
        }
      }
    }

    // Sort by datetime (newest first)
    allPayments.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

    // Calculate pagination
    const totalCount = allPayments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPayments = allPayments.slice(startIndex, endIndex);

    // Convert availableYears to sorted array
    const sortedAvailableYears = Array.from(availableYears).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    console.log(
      `Returning ${paginatedPayments.length} of ${totalCount} payments, page ${page}/${totalPages}`
    );

    res.json({
      payments: paginatedPayments,
      totalCount,
      totalPages,
      currentPage: page,
      availableYears: sortedAvailableYears,
    });
  } catch (err) {
    console.error("Error fetching payment history:", err);
    res.status(500).json({ error: "Failed to fetch payment history" });
  }
};

export const createCustomerPortalSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer found" });
      return;
    }

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.FRONTEND_URL}/billing`,
      });

      res.json({ url: portalSession.url });
    } catch (error: any) {
      if (
        error.type === "StripeInvalidRequestError" &&
        error.message.includes("configuration")
      ) {
        // Customer portal not configured - provide helpful error
        res.status(400).json({
          error: "Customer portal not configured",
          message:
            "The billing portal is not yet configured. Please contact support to manage your subscription.",
          supportAction: true,
        });
        return;
      }
      throw error;
    }
  } catch (err) {
    console.error("Error creating customer portal session:", err);
    res.status(500).json({ error: "Failed to create customer portal session" });
  }
};

export const getSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    if (!user?.stripeCustomerId) {
      res.json({
        status: "inactive",
        plan: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
      return;
    }

    // Get ALL subscriptions for the customer (active, past_due, etc.)
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      limit: 10, // Get more subscriptions to handle multiple
    });

    console.log(
      `Found ${subscriptions.data.length} subscriptions for customer ${user.stripeCustomerId}`
    );

    // Filter to active subscriptions
    const activeSubscriptions = subscriptions.data.filter(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    console.log(`Found ${activeSubscriptions.length} active subscriptions`);

    if (activeSubscriptions.length === 0) {
      res.json({
        status: "inactive",
        plan: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
      return;
    }

    // Get the most recent active subscription
    const subscription = activeSubscriptions.sort(
      (a, b) => b.created - a.created
    )[0];
    const priceId = subscription.items.data[0]?.price.id;

    console.log(
      `Most recent subscription: ${subscription.id}, priceId: ${priceId}`
    );

    // Map price IDs to plan names
    let planName = "Unknown";
    if (priceId === "price_1Rel4IPQH32NHq1WejI3Rmjh") {
      planName = "Pro";
    } else if (priceId === "price_1ReluzPQH32NHq1WtduW4KqR") {
      planName = "Team";
    }

    res.json({
      status: subscription.status,
      plan: planName,
      currentPeriodEnd: (subscription as any).current_period_end
        ? new Date(
            (subscription as any).current_period_end * 1000
          ).toISOString()
        : null,
      cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    console.error("Error fetching subscription status:", err);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
};

// Simple webhook status endpoint for debugging
export const webhookStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.json({
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
    environment: {
      stripeWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      emailHandling: "Stripe-managed (automatic)",
      features: [
        "Subscription status tracking",
        "Payment receipts (Stripe)",
        "Failed payment alerts (Stripe)",
        "Renewal reminders (Stripe)",
      ],
    },
  });
};
