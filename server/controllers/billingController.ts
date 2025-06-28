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
    let customerId = req.user?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user._id.toString() },
      });

      // Update user with new customer ID
      req.user.stripeCustomerId = customer.id;
      await req.user.save();

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
          email: req.user.email,
          metadata: { userId: req.user._id.toString() },
        });

        // Update user with new customer ID
        req.user.stripeCustomerId = customer.id;
        await req.user.save();

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
    let customerId = req.user?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      console.log("No customer ID found, creating new customer...");
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user._id.toString() },
      });

      // Update user with new customer ID
      req.user.stripeCustomerId = customer.id;
      await req.user.save();

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
          email: req.user.email,
          metadata: { userId: req.user._id.toString() },
        });

        // Update user with new customer ID
        req.user.stripeCustomerId = customer.id;
        await req.user.save();

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

    if (!req.user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer ID found for user" });
      return;
    }

    const customerId = req.user.stripeCustomerId;

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

    if (!req.user?.stripeCustomerId) {
      res.status(400).json({ error: "No Stripe customer ID found for user" });
      return;
    }

    const customerId = req.user.stripeCustomerId;

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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/billing?success=1`,
      cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=1`,
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
    let customerId = req.user?.stripeCustomerId;

    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: { userId: req.user._id.toString() },
      });

      // Update user with new customer ID
      req.user.stripeCustomerId = customer.id;
      await req.user.save();

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
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { subscriptionStatus: "active" });
      }
    }
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      const userId = subscription.metadata?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: "canceled",
        });
      }
    }
    // Handle other events as needed

    res.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).send(`Webhook Error: ${errorMessage}`);
  }
};
