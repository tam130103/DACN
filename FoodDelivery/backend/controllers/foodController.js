import foodModel from "../models/foodModels.js";
import fs from "fs";

// add food
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`; // Sửa lỗi template literal
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    Image: image_filename,
    category: req.body.category,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to add food" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch food list" });
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.Image}`, () => {})

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to remove food" });
  }
};

export { addFood, listFood, removeFood };
