const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function testCompleteSubscriptionFlow() {
  console.log("🧪 Testing Complete Subscription Flow...\n");

  try {
    // Step 1: Create a test customer
    console.log("1️⃣ Creating test customer...");
    const customer = await stripe.customers.create({
      email: "test-user@example.com",
      name: "Test User",
    });
    console.log(`✅ Customer created: ${customer.id}\n`);

    // Step 2: Create a checkout session for Pro plan
    console.log("2️⃣ Creating checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1RdyPhPQH32NHq1WgqA5eH6t", // Pro plan price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:5173/billing?success=true",
      cancel_url: "http://localhost:5173/billing?canceled=true",
    });
    console.log(`✅ Checkout session created: ${session.id}\n`);

    // Step 3: Simulate successful checkout completion
    console.log("3️⃣ Simulating checkout completion...");
    await stripe.checkout.sessions.expire(session.id);

    // Get the subscription that would be created
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Create a subscription manually to simulate the checkout completion
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: "price_1RdyPhPQH32NHq1WgqA5eH6t",
          },
        ],
      });
      console.log(`✅ Subscription created: ${subscription.id}\n`);

      // Step 4: Test plan change
      console.log("4️⃣ Testing plan change...");
      const updatedSubscription = await stripe.subscriptions.update(
        subscription.id,
        {
          items: [
            {
              id: subscription.items.data[0].id,
              price: "price_1RdyPfPQH32NHq1WarXrTqUV", // Basic plan price ID
            },
          ],
        }
      );
      console.log(`✅ Subscription updated: ${updatedSubscription.id}\n`);

      // Step 5: Test subscription cancellation
      console.log("5️⃣ Testing subscription cancellation...");
      await stripe.subscriptions.cancel(subscription.id);
      console.log(`✅ Subscription cancelled: ${subscription.id}\n`);
    }

    // Step 6: Test customer portal
    console.log("6️⃣ Creating customer portal session...");
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: "http://localhost:5173/billing",
    });
    console.log(`✅ Customer portal URL: ${portalSession.url}\n`);

    // Step 7: Clean up
    console.log("7️⃣ Cleaning up test data...");
    await stripe.customers.del(customer.id);
    console.log("✅ Test customer deleted\n");

    console.log("🎉 Complete subscription flow test completed successfully!");
    console.log("\n📧 Check your email for confirmation messages.");
    console.log("🪝 Check webhook logs for event processing.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

// Load environment variables
require("dotenv").config();

// Run the test
testCompleteSubscriptionFlow();
