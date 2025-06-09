// server/templates/baseEmail.ts

type EmailMode =
  | "signup"
  | "verify"
  | "reset"
  | "forgot"
  | "subscription_cancelled"
  | "payment_missed"
  | "login_alert"
  | "contact_us"; 

interface EmailTemplateProps {
  mode: EmailMode;
  username?: string;
  email?: string;
  actionUrl?: string;
  location?: string;
  time?: string;
  message?: string; 
}

export const emailTemplate = ({
  mode,
  username,
  email,
  actionUrl,
  location,
  time,
  message, 
}: EmailTemplateProps): string => {
  const content = {
    signup: {
      title: "Welcome to Waypoint 🎉",
      message: `Thank you for signing up, <b>${
        username || email
      }</b>! We’re excited to have you onboard.`,
      button: null,
    },
    verify: {
      title: "Verify your Waypoint Account",
      message: `Hi <b>${
        username || email
      }</b>,<br>Please verify your email address to activate your account.`,
      button: actionUrl
        ? `<a href="${actionUrl}" style="display:inline-block;background:#ff7eb3;color:#fff;text-decoration:none;font-weight:600;padding:12px 32px;border-radius:8px;font-size:16px;margin:24px 0;">Verify Account</a>`
        : null,
    },
    reset: {
      title: "Reset Your Waypoint Password",
      message: `Hi <b>${
        username || email
      }</b>,<br>You requested a password reset. Click below to set a new password.`,
      button: actionUrl
        ? `<a href="${actionUrl}" style="display:inline-block;background:#ff7eb3;color:#fff;text-decoration:none;font-weight:600;padding:12px 32px;border-radius:8px;font-size:16px;margin:24px 0;">Reset Password</a>`
        : null,
    },
    forgot: {
      title: "Reset Your Waypoint Password",
      message: `Hi <b>${
        username || email
      }</b>,<br>You requested a password reset. Click below to set a new password.`,
      button: actionUrl
        ? `<a href="${actionUrl}" style="display:inline-block;background:#ff7eb3;color:#fff;text-decoration:none;font-weight:600;padding:12px 32px;border-radius:8px;font-size:16px;margin:24px 0;">Reset Password</a>`
        : null,
    },
    subscription_cancelled: {
      title: "Your Waypoint Subscription Was Cancelled",
      message: `Hi <b>${
        username || email
      }</b>,<br>Your subscription has been cancelled. If this was not intentional, you can reactivate your subscription below.`,
      button: actionUrl
        ? `<a href="${actionUrl}" style="display:inline-block;background:#ff7eb3;color:#fff;text-decoration:none;font-weight:600;padding:12px 32px;border-radius:8px;font-size:16px;margin:24px 0;">Reactivate Subscription</a>`
        : null,
    },
    payment_missed: {
      title: "Payment Issue with Your Waypoint Subscription",
      message: `Hi <b>${
        username || email
      }</b>,<br>We were unable to process your recent payment. Please update your payment method to avoid service interruption.`,
      button: actionUrl
        ? `<a href="${actionUrl}" style="display:inline-block;background:#ff7eb3;color:#fff;text-decoration:none;font-weight:600;padding:12px 32px;border-radius:8px;font-size:16px;margin:24px 0;">Update Payment Method</a>`
        : null,
    },
    login_alert: {
      title: "New Login to Your Waypoint Account",
      message: `Hi <b>${
        username || email
      }</b>,<br>We noticed a login to your account.`,
      button: null,
      extraInfo: `
        <ul style="text-align:left;max-width:320px;margin:12px auto;padding:0;list-style:none;color:#d4d4d8;">
          <li><strong>Location:</strong> ${location || "Unknown"}</li>
          <li><strong>Time:</strong> ${time || "Unknown"}</li>
        </ul>
        <p style="margin-top:12px;">If this wasn't you, please reset your password immediately.</p>
      `,
    },
    contact_us: {
      title: "New Contact Us Message",
      message: `You have received a new message from <b>${
        username || email
      }</b>.<br><br>
        <strong>Message:</strong><br>
        <span style="color:#d4d4d8;">${
          message || "No message provided."
        }</span>`,
      button: null,
    },
  }[mode];

  return `
    <div style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a); padding: 40px 0; font-family: Inter, Arial, sans-serif; color: #ffffff;">
      <table align="center" width="100%" style="max-width: 560px; background: #18181b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);">
        <!-- Header / Navbar -->
        <tr>
          <td style="background: #000000; padding: 16px 24px; text-align: left;">
            <h6 style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">
              Waypoint
            </h6>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 32px 24px; text-align: center;">
            <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #ffffff;">${
              content.title
            }</h2>
            <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #d4d4d8;">${
              content.message
            }</div>
            ${
              content.extraInfo
                ? content.extraInfo
                : content.button
                ? content.button
                : ""
            }
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 24px; text-align: center; font-size: 12px; color: #71717a;">
            If you have any questions, just reply to this email.<br><br>
            <hr style="border: none; border-top: 1px solid #2e2e2e; margin: 24px 0;">
            &copy; ${new Date().getFullYear()} Waypoint. All rights reserved.
          </td>
        </tr>
      </table>
    </div>
  `;
};
