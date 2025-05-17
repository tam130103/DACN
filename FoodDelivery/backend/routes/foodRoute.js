import express from 'express';
import { addFood,listFood,removeFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// img storage engine

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Image is required" });
    }
    next();
}, addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);


export default foodRouter;