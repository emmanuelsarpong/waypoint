const axios = require("axios");

const sendManualWebhook = async () => {
  try {
    console.log("Sending manual webhook test...");
    
    const webhookData = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_manual_" + Date.now(),
          object: "checkout.session",
          amount_total: 700, // $7.00 CAD in cents
          status: "complete",
          metadata: {
            userId: "test_user_id_manual",
          },
          subscription: "sub_test_manual_" + Date.now(),
          customer: "cus_test_manual",
        },
      },
    };

    const response = await axios.post(
      "http://localhost:3000/api/billing/webhook",
      webhookData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Webhook sent successfully!");
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("❌ Webhook test failed:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
};

sendManualWebhook();
