import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    console.error("Server will continue without database connection");
    return false;
  }
};

export default connectDB;
