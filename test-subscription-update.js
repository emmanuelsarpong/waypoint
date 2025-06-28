require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function testSubscriptionUpdate() {
  try {
    console.log("🧪 Testing subscription update webhook...");

    // Get a test customer first
    const customers = await stripe.customers.list({ limit: 1 });
    if (customers.data.length === 0) {
      console.log("❌ No customers found. Create a customer first.");
      return;
    }

    const customer = customers.data[0];
    console.log(`📋 Using customer: ${customer.id} (${customer.email})`);

    // Check if customer has subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      console.log("❌ No subscriptions found for this customer.");
      return;
    }

    const subscription = subscriptions.data[0];
    console.log(`📋 Found subscription: ${subscription.id}`);
    console.log(`📋 Current status: ${subscription.status}`);
    console.log(`📋 Current plan: ${subscription.items.data[0].price.id}`);

    // List all available prices to find another one to switch to
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      limit: 10,
    });

    console.log("\n📋 Available pricing plans:");
    prices.data.forEach((price, index) => {
      console.log(
        `${index + 1}. ${price.id} - $${(price.unit_amount / 100).toFixed(2)}/${
          price.recurring.interval
        }`
      );
    });

    // Try to find a different price to switch to
    const currentPriceId = subscription.items.data[0].price.id;
    const newPrice = prices.data.find((price) => price.id !== currentPriceId);

    if (!newPrice) {
      console.log("❌ No alternative price found to switch to.");
      return;
    }

    console.log(
      `\n🔄 Attempting to update subscription from ${currentPriceId} to ${newPrice.id}...`
    );

    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPrice.id,
          },
        ],
        proration_behavior: "create_prorations",
      }
    );

    console.log("✅ Subscription updated successfully!");
    console.log(`📋 New subscription status: ${updatedSubscription.status}`);
    console.log(`📋 New plan: ${updatedSubscription.items.data[0].price.id}`);
    console.log(
      "\n🎯 This should trigger a customer.subscription.updated webhook event."
    );
    console.log(
      "💡 Check your webhook logs and Stripe Dashboard Events tab to verify."
    );
  } catch (error) {
    console.error("❌ Error testing subscription update:", error.message);
  }
}

testSubscriptionUpdate();
