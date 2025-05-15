import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    Image: {type: String, required: true},
    category: {type: String, required: true},
})

const foodModel = mongoose.model.food || mongoose.model("Food", foodSchema);

export default foodModel;