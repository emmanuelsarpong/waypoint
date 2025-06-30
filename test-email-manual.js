const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendTestEmail = async () => {
  try {
    console.log("Testing email configuration...");
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS configured:", !!process.env.SMTP_PASS);

    const result = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to self for testing
      subject: "Waypoint Test Email - " + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Waypoint</h1>
            <h2 style="margin: 20px 0 10px 0; color: #4ade80;">Test Email Successful!</h2>
            <p style="margin: 0; font-size: 16px; color: #d1d5db;">This confirms your email service is working</p>
          </div>
          
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="color: #333; margin-top: 0;">Email Test Details</h3>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #4ade80;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">Test Time:</td>
                  <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">SMTP Service:</td>
                  <td style="padding: 8px 0; color: #333;">Gmail</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #555;">From Address:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    process.env.SMTP_USER
                  }</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; margin-top: 20px;">If you're seeing this email, your Waypoint billing system email notifications are working correctly!</p>
          </div>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", result.messageId);
    console.log("Response:", result.response);
  } catch (error) {
    console.error("❌ Test email failed:", error);
  } finally {
    process.exit(0);
  }
};

sendTestEmail();
