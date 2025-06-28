#!/usr/bin/env node

/**
 * Comprehensive Waypoint Billing System Test
 *
 * This script tests the complete billing system end-to-end:
 * 1. Email service functionality
 * 2. Webhook endpoint accessibility
 * 3. Webhook processing and email sending
 * 4. User subscription status updates
 * 5. System configuration verification
 */

const axios = require("axios");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

// Configuration
const BACKEND_URL = "http://localhost:3000";
const NGROK_URL = "https://1598-70-24-228-252.ngrok-free.app";
const TEST_USER_ID = "684b99fbb977ee27514340af"; // emmanuel.sarpong12@gmail.com
const TEST_EMAIL = "emmanuel.sarpong12@gmail.com";

// Test colors for output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test 1: Email Service
async function testEmailService() {
  log("blue", "🧪 Testing Email Service...");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: TEST_EMAIL,
      subject: "Waypoint Billing Test - Email Service",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #4ade80;">✅ Email Service Test Successful</h2>
          <p>This confirms your Waypoint billing email system is working correctly.</p>
          <p>Test performed at: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    log("green", `✅ Email service working - Message ID: ${result.messageId}`);
    return true;
  } catch (error) {
    log("red", `❌ Email service failed: ${error.message}`);
    return false;
  }
}

// Test 2: Webhook Endpoint Accessibility
async function testWebhookEndpoint() {
  log("blue", "🧪 Testing Webhook Endpoint Accessibility...");

  try {
    // Test local endpoint
    const localResponse = await axios.get(
      `${BACKEND_URL}/api/billing/webhook-status`
    );
    log(
      "green",
      `✅ Local webhook endpoint accessible: ${localResponse.data.message}`
    );

    // Test ngrok endpoint
    const ngrokResponse = await axios.get(
      `${NGROK_URL}/api/billing/webhook-status`
    );
    log(
      "green",
      `✅ Ngrok webhook endpoint accessible: ${ngrokResponse.data.message}`
    );

    return true;
  } catch (error) {
    log("red", `❌ Webhook endpoint test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Database Connection and User Model
async function testDatabase() {
  log("blue", "🧪 Testing Database Connection and User Model...");

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const User = mongoose.model("User", {
      email: String,
      stripeCustomerId: String,
      subscriptionStatus: String,
    });

    const user = await User.findById(TEST_USER_ID);
    if (user) {
      log("green", `✅ Database connected, test user found: ${user.email}`);
      log(
        "green",
        `   Stripe Customer ID: ${user.stripeCustomerId || "Not set"}`
      );
      log(
        "green",
        `   Subscription Status: ${user.subscriptionStatus || "Not set"}`
      );
    } else {
      log("red", `❌ Test user not found`);
      return false;
    }

    return true;
  } catch (error) {
    log("red", `❌ Database test failed: ${error.message}`);
    return false;
  }
}

// Test 4: Webhook Processing
async function testWebhookProcessing() {
  log("blue", "🧪 Testing Webhook Processing...");

  try {
    const webhookData = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_comprehensive_test_" + Date.now(),
          amount_total: 700, // $7.00 Pro Plan
          status: "complete",
          metadata: { userId: TEST_USER_ID },
          subscription: "sub_comprehensive_test_" + Date.now(),
        },
      },
    };

    const response = await axios.post(
      `${BACKEND_URL}/api/billing/webhook`,
      webhookData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200 && response.data.received) {
      log("green", "✅ Webhook processing successful");

      // Wait a moment for processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if user subscription status was updated
      const User = mongoose.model("User", {
        email: String,
        stripeCustomerId: String,
        subscriptionStatus: String,
      });

      const updatedUser = await User.findById(TEST_USER_ID);
      if (updatedUser && updatedUser.subscriptionStatus === "active") {
        log("green", "✅ User subscription status updated to active");
        return true;
      } else {
        log(
          "red",
          `❌ User subscription status not updated properly: ${updatedUser?.subscriptionStatus}`
        );
        return false;
      }
    } else {
      log("red", "❌ Webhook processing failed");
      return false;
    }
  } catch (error) {
    log("red", `❌ Webhook processing test failed: ${error.message}`);
    return false;
  }
}

// Test 5: System Configuration
async function testSystemConfiguration() {
  log("blue", "🧪 Testing System Configuration...");

  const checks = [
    { name: "SMTP_USER", value: !!process.env.SMTP_USER },
    { name: "SMTP_PASS", value: !!process.env.SMTP_PASS },
    { name: "STRIPE_SECRET_KEY", value: !!process.env.STRIPE_SECRET_KEY },
    {
      name: "STRIPE_WEBHOOK_SECRET",
      value: !!process.env.STRIPE_WEBHOOK_SECRET,
    },
    { name: "MONGO_URI", value: !!process.env.MONGO_URI },
    { name: "FRONTEND_URL", value: !!process.env.FRONTEND_URL },
  ];

  let allPassed = true;

  checks.forEach((check) => {
    if (check.value) {
      log("green", `✅ ${check.name} configured`);
    } else {
      log("red", `❌ ${check.name} missing`);
      allPassed = false;
    }
  });

  return allPassed;
}

// Main test runner
async function runAllTests() {
  log("yellow", "🚀 Starting Waypoint Billing System Comprehensive Test");
  log("yellow", "=".repeat(60));

  const tests = [
    { name: "System Configuration", fn: testSystemConfiguration },
    { name: "Database Connection", fn: testDatabase },
    { name: "Email Service", fn: testEmailService },
    { name: "Webhook Endpoint", fn: testWebhookEndpoint },
    { name: "Webhook Processing", fn: testWebhookProcessing },
  ];

  const results = [];

  for (const test of tests) {
    log("yellow", `\n🧪 Running ${test.name} test...`);
    const passed = await test.fn();
    results.push({ name: test.name, passed });
  }

  // Summary
  log("yellow", "\n" + "=".repeat(60));
  log("yellow", "📊 TEST RESULTS SUMMARY");
  log("yellow", "=".repeat(60));

  results.forEach((result) => {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    const color = result.passed ? "green" : "red";
    log(color, `${status} - ${result.name}`);
  });

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  if (passedCount === totalCount) {
    log("green", `\n🎉 ALL TESTS PASSED (${passedCount}/${totalCount})`);
    log("green", "✅ Your Waypoint billing system is production-ready!");
  } else {
    log("red", `\n❌ SOME TESTS FAILED (${passedCount}/${totalCount} passed)`);
    log(
      "yellow",
      "⚠️  Please address the failing tests before going to production."
    );
  }

  // Cleanup
  await mongoose.disconnect();

  log("yellow", "\n🏁 Testing complete!");
}

// Handle unhandled rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

// Run the tests
runAllTests().catch(console.error);
