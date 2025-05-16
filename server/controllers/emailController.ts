import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";

export const sendEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
};
