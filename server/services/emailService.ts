import nodemailer from "nodemailer";
import { emailTemplate } from "../templates/baseEmail";

// All billing emails are now handled by Stripe directly

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    firstName?: string
  ): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const html = emailTemplate({
      mode: "verify",
      username: firstName,
      email,
      actionUrl: verificationUrl,
    });

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address - Waypoint",
      html,
    });
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName?: string
  ): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const html = emailTemplate({
      mode: "reset",
      username: firstName,
      email,
      actionUrl: resetUrl,
    });

    await this.sendEmail({
      to: email,
      subject: "Reset Your Password - Waypoint",
      html,
    });
  }
}

export const emailService = new EmailService();
