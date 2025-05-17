import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes";
import protectedRoutes from "./routes/protectedRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import connectDB from "./config/db";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/email", emailRoutes);
app.use("/protected", protectedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Error handling middleware (should be after all routes)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
