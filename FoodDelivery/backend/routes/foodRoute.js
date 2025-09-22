// FoodDelivery/backend/routes/foodRoute.js
import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
  },
});

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

export default foodRouter;
