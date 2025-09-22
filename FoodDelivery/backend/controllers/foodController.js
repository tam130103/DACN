// FoodDelivery/backend/controllers/foodController.js
import foodModel from "../models/foodModels.js";
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";

// Config Cloudinary từ ENV
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUD_FOLDER = process.env.CLOUDINARY_FOLDER || "food_delivery";

// Upload BUFFER lên Cloudinary
const uploadBufferToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder: CLOUD_FOLDER,
        resource_type: "image",
        filename_override: filename,
        unique_filename: true,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

// ----------------- Add food -----------------
export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "All fields are required" });
    }
    if (!req.file) {
      return res.json({ success: false, message: "Image is required (field: image)" });
    }

    // Upload ảnh lên Cloudinary từ buffer của multer memoryStorage
    const { url, publicId } = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname || `image_${Date.now()}`
    );

    const doc = new foodModel({
      name,
      description,
      price,
      category,
      image: url,              // LƯU URL Cloudinary
      imagePublicId: publicId, // LƯU public_id để xoá sau này
    });

    await doc.save();
    return res.json({ success: true, message: "Food added successfully", data: doc });
  } catch (error) {
    console.error("Error in addFood:", error);
    return res.json({ success: false, message: "Failed to add food" });
  }
};

// ----------------- List food -----------------
export const listFood = async (_req, res) => {
  try {
    const food = await foodModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: food });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to fetch food list" });
  }
};

// ----------------- Remove food -----------------
export const removeFood = async (req, res) => {
  try {
    const { id } = req.body;
    const doc = await foodModel.findById(id);
    if (!doc) return res.json({ success: false, message: "Food item not found" });

    // Nếu là ảnh Cloudinary thì xoá bên Cloudinary
    if (doc.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(doc.imagePublicId);
      } catch (e) {
        console.warn("Cloudinary destroy warn:", e?.message || e);
      }
    } else {
      // Fallback: nếu là ảnh local (legacy) thì xoá file nếu còn
      if (doc.image && !doc.image.startsWith("http")) {
        const localPath = path.join(process.cwd(), "uploads", doc.image);
        if (fs.existsSync(localPath)) {
          try { fs.unlinkSync(localPath); } catch {}
        }
      }
    }

    await foodModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Error in removeFood:", error);
    res.json({ success: false, message: "Failed to remove food" });
  }
};
