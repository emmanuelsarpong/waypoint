import "dotenv/config";

import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import billingRoutes from "./routes/billingRoutes";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorMiddleware";
import session from "express-session";
import passport from "passport";
import "./config/passportSetup";
import oauthRoutes from "./routes/oauthRoutes";

connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/email", emailRoutes);
app.use("/protected", protectedRoutes);
app.use("/auth", authRoutes);
app.use("/auth", oauthRoutes);
app.use("/user", userRoutes);
app.use("/api/billing", billingRoutes);

// Add this before error handling middleware
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("JWT_SECRET at startup:", process.env.JWT_SECRET);
