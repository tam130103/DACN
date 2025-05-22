import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// App configuration
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB().catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
});

// API endpoints
app.use('/api/food', foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

