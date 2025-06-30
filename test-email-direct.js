// Simple test to verify email sending works
const nodemailer = require("nodemailer");

const testEmail = async () => {
  try {
    console.log("Testing email sending...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "emmanuel.sarpong12@gmail.com",
        pass: "snbofnxcjcbdvqfp",
      },
    });

    const result = await transporter.sendMail({
      from: "emmanuel.sarpong12@gmail.com",
      to: "emmanuel.sarpong12@gmail.com",
      subject: "Waypoint Billing Test - " + new Date().toLocaleString(),
      html: `
        <h1>Test Email from Waypoint</h1>
        <p>This is a test to verify email sending is working.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    console.log("✅ Email sent successfully!", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email failed:", error);
    throw error;
  }
};

testEmail();
