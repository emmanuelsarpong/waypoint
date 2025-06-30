// Direct test of the email service
const mongoose = require("mongoose");
require("dotenv").config();

// Import the email function (we'll simulate it)
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPaymentConfirmationEmail = async (
  userEmail,
  amount,
  planName,
  paymentDate,
  nextBillingDate,
  isRecurring = true,
  isPlanChange = false
) => {
  try {
    console.log(`Sending payment confirmation email to: ${userEmail}`);

    const subject = isPlanChange
      ? `Waypoint - Plan Change Confirmation`
      : `Waypoint - Payment Confirmation`;

    const html = `
      <div style="background-color: #000; color: #fff; padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="color: #4ade80;">Payment ${
          isPlanChange ? "Update" : "Confirmation"
        }</h1>
        <p>Thank you for your ${
          isPlanChange ? "plan change" : "subscription"
        }!</p>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Plan:</strong> ${planName}</p>
          <p><strong>Amount:</strong> ${amount}</p>
          <p><strong>Payment Date:</strong> ${paymentDate}</p>
          ${
            nextBillingDate
              ? `<p><strong>Next Billing Date:</strong> ${nextBillingDate}</p>`
              : ""
          }
        </div>
        <p>You can manage your subscription at any time from your billing dashboard.</p>
        <p style="color: #9ca3af; font-size: 0.9rem; margin-top: 30px;">
          This email was sent to ${userEmail}. If you did not make this payment, please contact support immediately.
        </p>
      </div>
    `;

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error(`❌ Email failed:`, error);
    throw error;
  }
};

const testWebhookEmails = async () => {
  try {
    console.log("🧪 Testing webhook email functionality...");

    // Test email sending with real scenario data
    const testEmail = "emmanuel.sarpong12@gmail.com";
    const amount = "$7.00 CAD";
    const planName = "Pro Plan";
    const paymentDate = new Date().toLocaleDateString();
    const nextBillingDate = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString();

    console.log(`Sending payment confirmation to: ${testEmail}`);
    await sendPaymentConfirmationEmail(
      testEmail,
      amount,
      planName,
      paymentDate,
      nextBillingDate,
      true,
      false // Initial payment, not plan change
    );

    console.log("✅ Test completed successfully!");

    // Also test plan change email
    console.log(`Sending plan change confirmation to: ${testEmail}`);
    await sendPaymentConfirmationEmail(
      testEmail,
      "$25.00 CAD",
      "Team Plan",
      paymentDate,
      nextBillingDate,
      true,
      true // This is a plan change
    );

    console.log("✅ All email tests completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

testWebhookEmails();
