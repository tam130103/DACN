import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { connectDB } from './config/db.js';

import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

// 1) Dùng PORT của Render (fallback 5000 khi local)
const PORT = process.env.PORT || 5000;

// 2) CORS: chỉ cho phép domain frontend (Vercel) – lấy từ ENV
app.use(cors({
  origin: [process.env.FRONTEND_URL], // ví dụ: https://dacn-three.vercel.app
  credentials: true
}));

app.use(express.json());

// 3) Kết nối DB trước rồi mới start server
(async () => {
  try {
    await connectDB(); // bên trong connectDB dùng process.env.MONGODB_URL
    console.log('✅ Mongo connected');

    // API endpoints
    app.use('/api/food', foodRouter);
    app.use('/images', express.static('uploads'));
    app.use('/api/user', userRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/order', orderRouter);

    app.get('/', (_, res) => res.send('API Working'));

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
})();
