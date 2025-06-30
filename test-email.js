// Simple email test script
const nodemailer = require("nodemailer");

// Create transporter using the same config as your app
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emmanuel.sarpong12@gmail.com",
    pass: "snbofnxcjcbdvqfp",
  },
});

// Test email
async function testEmail() {
  try {
    console.log("Testing email configuration...");

    const mailOptions = {
      from: "emmanuel.sarpong12@gmail.com",
      to: "emmanuel.sarpong12@gmail.com",
      subject: "Waypoint - Email Test",
      text: "This is a test email from your Waypoint application.",
      html: "<h1>Email Test Successful!</h1><p>Your email configuration is working correctly.</p>",
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("Message ID:", result.messageId);
    console.log("Response:", result.response);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
}

testEmail();
