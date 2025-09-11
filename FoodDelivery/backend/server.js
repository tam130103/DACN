import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { connectDB } from './config/db.js';

import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 10000; // Render sẽ inject PORT; 10000 để test local

// ----- CORS -----
const allowlist = [
  process.env.FRONTEND_URL,      // ví dụ: https://dacn-three.vercel.app
  process.env.FRONTEND_URL_ALT,  // tùy chọn
  'http://localhost:5173',       // dev Vite
  'http://localhost:3000'        // dev CRA
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // Cho phép Postman/cURL (origin undefined) và các URL trong allowlist
    if (!origin || allowlist.some(u => origin?.startsWith(u))) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`), false);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/images', express.static('uploads')); // phục vụ ảnh upload

// Health check để Render detect nhanh
app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/', (_, res) => res.send('API Working'));

// ---- Start server sau khi DB sẵn sàng ----
(async () => {
  try {
    await connectDB(); // dùng MONGODB_URI, có timeout ở db.js
    console.log('✅ Mongo connected');

    // API routes
    app.use('/api/food', foodRouter);
    app.use('/api/user', userRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/order', orderRouter);

    // Quan trọng: bind 0.0.0.0 để Render truy cập được
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err?.message || err);
    process.exit(1);
  }
})();
