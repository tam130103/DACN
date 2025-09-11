import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) throw new Error("❌ MONGODB_URL is not defined in env");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
