// FoodDelivery/backend/models/foodModels.js
import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, required: true },      // secure_url Cloudinary
    imagePublicId:{ type: String, required: true },     // public_id Cloudinary
    category:    { type: String, required: true },
  },
  { timestamps: true }
);

const foodModel = mongoose.models.Food || mongoose.model('Food', foodSchema);
export default foodModel;
