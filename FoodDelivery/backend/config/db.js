import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://tama1301:tam130103@cluster0.3uevldo.mongodb.net/FoodDelivery').then(()=>console.log("MongoDB connected"));
} 