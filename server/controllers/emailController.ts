import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import { emailTemplate } from "../templates/baseEmail";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mode, firstName, email, actionUrl, location, time, message } =
      req.body;

    if (!mode || !email || !firstName) {
      return res
        .status(400)
        .json({ error: "Mode, first name, and email are required." });
    }

    const allowedModes = [
      "signup",
      "verify",
      "reset",
      "subscription_cancelled",
      "payment_missed",
      "login_alert",
      "contact_us",
    ];

    if (!allowedModes.includes(mode)) {
      return res.status(400).json({ error: "Invalid email mode." });
    }

    const subjectMap: { [key: string]: string } = {
      signup: "Welcome to Waypoint 🎉",
      verify: "Verify your Waypoint Account",
      reset: "Reset Your Waypoint Password",
      subscription_cancelled: "Your Waypoint Subscription Was Cancelled",
      payment_missed: "Payment Issue with Your Waypoint Subscription",
      login_alert: "New Login to Your Waypoint Account",
      contact_us: "New Contact Us Message", 
    };

    const finalSubject = subjectMap[mode] || "Waypoint Notification";

    const html = emailTemplate({
      mode,
      username: firstName, 
      email,
      actionUrl,
      location,
      time,
      message,
    });

    await transporter.sendMail({
      from: `"Waypoint" <${process.env.SMTP_USER}>`,
      to: email,
      subject: finalSubject,
      html,
    });

    console.log(`Email sent to ${email} with mode ${mode}`);

    res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};
