import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://DACN:tam130103@cluster0.iogio2t.mongodb.net/FoodDelivery').then(()=>console.log("MongoDB connected"));
} 