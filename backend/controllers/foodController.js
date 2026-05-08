// FoodDelivery/backend/controllers/foodController.js
import foodModel from '../models/foodModels.js';
import cloudinary from 'cloudinary';

// Cấu hình Cloudinary từ ENV
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER = process.env.CLOUDINARY_FOLDER || 'food';

export const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Upload buffer -> Cloudinary qua data URI
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const up = await cloudinary.v2.uploader.upload(dataUri, { folder: FOLDER });

    const doc = await foodModel.create({
      name,
      description,
      price: Number(price),
      category,
      image: up.secure_url,         // URL ảnh
      imagePublicId: up.public_id,  // BẮT BUỘC: để xoá sau này
    });

    res.json({ success: true, message: 'Food added successfully', data: doc });
  } catch (err) {
    console.error('addFood error:', err);
    res.status(500).json({ success: false, message: 'Failed to add food' });
  }
};

export const listFood = async (_req, res) => {
  try {
    const food = await foodModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: food });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Failed to fetch food list' });
  }
};

export const removeFood = async (req, res) => {
  try {
    const item = await foodModel.findById(req.body.id);
    if (!item) return res.json({ success: false, message: 'Food item not found' });

    // Nếu có public_id thì xoá trên Cloudinary
    if (item.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(item.imagePublicId);
      } catch (e) {
        console.warn('Cloudinary destroy warn:', e?.message || e);
      }
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Food removed successfully' });
  } catch (err) {
    console.error('removeFood error:', err);
    res.json({ success: false, message: 'Failed to remove food' });
  }
};
