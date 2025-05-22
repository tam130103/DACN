import foodModel from "../models/foodModels.js";
import fs from "fs";

// Add food
const addFood = async (req, res) => {
    const { name, description, price, category } = req.body;
    const image_filename = req.file?.filename;

    try {
        if (!name || !description || !price || !category || !image_filename) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const food = new foodModel({
            name,
            description,
            price,
            image: image_filename,
            category,
        });

        await food.save();
        res.json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error("Error in addFood:", error);
        res.json({ success: false, message: "Failed to add food" });
    }
};

// List all food
const listFood = async (req, res) => {
    try {
        const food = await foodModel.find({});
        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Failed to fetch food list" });
    }
};

// Remove food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        const imagePath = `uploads/${food.image}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed successfully" });
    } catch (error) {
        console.error("Error in removeFood:", error);
        res.json({ success: false, message: "Failed to remove food" });
    }
};

export { addFood, listFood, removeFood };
