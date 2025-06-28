import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
  try {
    console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
    console.log("SMTP config:", {
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (
  userEmail: string,
  amount: string,
  planName: string,
  paymentDate: string,
  nextBillingDate?: string,
  isRecurring: boolean = true
) => {
  const subject = `Payment Confirmation - ${planName} Subscription`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Waypoint</h1>
        <h2 style="margin: 20px 0 10px 0; color: #4ade80;">Payment Confirmed!</h2>
        <p style="margin: 0; font-size: 16px; color: #d1d5db;">Thank you for your ${planName} subscription</p>
      </div>
      
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">Payment Details</h3>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #4ade80;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Plan:</td>
              <td style="padding: 8px 0; color: #333;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Amount:</td>
              <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold;">${amount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Payment Date:</td>
              <td style="padding: 8px 0; color: #333;">${paymentDate}</td>
            </tr>
            ${
              nextBillingDate
                ? `<tr>
                     <td style="padding: 8px 0; font-weight: bold; color: #555;">Next Billing:</td>
                     <td style="padding: 8px 0; color: #333;">${nextBillingDate}</td>
                   </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Status:</td>
              <td style="padding: 8px 0; color: #4ade80; font-weight: bold;">✅ Paid</td>
            </tr>
          </table>
        </div>
        
        ${
          isRecurring
            ? `<div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                 <h4 style="color: #1e40af; margin: 0 0 8px 0;">📅 Recurring Subscription</h4>
                 <p style="color: #1e3a8a; margin: 0; font-size: 14px;">
                   Your subscription will automatically renew monthly. You'll be charged <strong>${amount}</strong> 
                   ${
                     nextBillingDate
                       ? `on <strong>${nextBillingDate}</strong>`
                       : "on the same day each month"
                   }. 
                   You can cancel or modify your subscription anytime in your billing dashboard.
                 </p>
               </div>`
            : ""
        }
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f0f9f4; border-radius: 8px;">
          <h4 style="color: #065f46; margin: 0 0 10px 0;">What's Next?</h4>
          <p style="color: #047857; margin: 0; line-height: 1.6;">
            Your ${planName} subscription is now active! You can now enjoy all the features included in your plan. 
            Visit your dashboard to start tracking your movements and achieving your fitness goals.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="display: inline-block; background-color: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
          If you have any questions about your subscription or need support, feel free to contact us. 
          You can manage your subscription and view payment history in your 
          <a href="${
            process.env.FRONTEND_URL
          }/billing" style="color: #4ade80;">billing dashboard</a>.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>© 2025 Waypoint. All rights reserved.</p>
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </div>
  `;

  const text = `
    Payment Confirmation - Waypoint
    
    Thank you for your payment!
    
    Payment Details:
    Plan: ${planName}
    Amount: ${amount}
    Date: ${paymentDate}
    Status: Paid
    
    Your ${planName} subscription is now active! Visit ${process.env.FRONTEND_URL}/dashboard to get started.
    
    Questions? Contact support or visit ${process.env.FRONTEND_URL}/billing to manage your subscription.
    
    © 2025 Waypoint. All rights reserved.
  `;

  await sendEmail({
    to: userEmail,
    subject,
    text,
    html,
  });
};
