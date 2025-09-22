import foodModel from "../models/foodModels.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category || !req.file) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // upload buffer lên Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "food" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const doc = await foodModel.create({
      name,
      description,
      price,
      category,
      image: uploadResult.secure_url,      // lưu URL tuyệt đối
      // imageId: uploadResult.public_id,   // (tuỳ chọn) lưu để xoá sau này
    });

    res.json({ success: true, message: "Food added successfully", data: doc });
  } catch (e) {
    console.error("addFood error:", e);
    res.json({ success: false, message: "Failed to add food" });
  }
};

export const listFood = async (_req, res) => {
  try {
    const items = await foodModel.find({});
    res.json({ success: true, data: items });
  } catch (e) {
    res.json({ success: false, message: "Failed to fetch food list" });
  }
};

export const removeFood = async (req, res) => {
  try {
    const item = await foodModel.findById(req.body.id);
    if (!item) return res.json({ success: false, message: "Food item not found" });

    // Nếu bạn có lưu public_id -> huỷ trên Cloudinary:
    // if (item.imageId) await cloudinary.uploader.destroy(item.imageId);

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (e) {
    console.error("removeFood error:", e);
    res.json({ success: false, message: "Failed to remove food" });
  }
};
