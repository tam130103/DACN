// FoodDelivery/backend/models/foodModels.js
import mongoose from "mongoose";

const CATEGORIES = [
  "Salad", "Rolls", "Deserts", "Sandwich",
  "Cake", "Pure Veg", "Pasta", "Noodles",
];

const foodSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    // Lưu secure_url từ Cloudinary
    image:       { type: String, required: true },      
    // Lưu public_id để xoá/replace ảnh trên Cloudinary
    imagePublicId: { type: String, required: true },     

    category:    { type: String, required: true, enum: CATEGORIES },
  },
  { timestamps: true }
);

// Tìm kiếm nhanh theo tên + lọc theo category
foodSchema.index({ name: "text", category: 1 });

const foodModel =
  mongoose.models.Food || mongoose.model("Food", foodSchema);

export default foodModel;
