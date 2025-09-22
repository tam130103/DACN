// FoodDelivery/backend/routes/foodRoute.js
import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

const foodRouter = express.Router();

// Dùng memory storage vì ta upload trực tiếp tới Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.post('/remove', removeFood);

export default foodRouter;
