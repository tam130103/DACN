import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // dùng bộ nhớ

router.post('/add', upload.single('image'), (req, res, next) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
  next();
}, addFood);

router.get('/list', listFood);
router.post('/remove', removeFood);

export default router;
