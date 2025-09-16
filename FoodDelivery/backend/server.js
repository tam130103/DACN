// FoodDelivery/backend/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { connectDB } from './config/db.js';

import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const PORT = process.env.PORT || 10000;

// ========== CORS ==========
const corsMw = cors({
  origin: (origin, cb) => {
    // Cho phép request không có Origin (Postman/cURL, healthz, browser preload)
    if (!origin) return cb(null, true);

    // Cho phép tất cả origin (debug / deploy public)
    // 👉 Nếu muốn siết lại: thay vì cb(null,true), chỉ cho phép những domain cụ thể
    // như FRONTEND_URL và ADMIN_URL từ .env
    return cb(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 86400,
});

app.use(corsMw);
// Express v5 dùng (.*) thay vì '*'
app.options('(.*)', corsMw);

// ========== Middleware ==========
app.use(express.json());

// phục vụ file ảnh upload
app.use(
  '/images',
  express.static('uploads', {
    maxAge: '1d',
    etag: true,
  })
);

// ========== Health check ==========
app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/', (_, res) => res.send('API Working'));

// ========== Start server ==========
(async () => {
  try {
    await connectDB();
    console.log('✅ Mongo connected');

    // Routes
    app.use('/api/food', foodRouter);
    app.use('/api/user', userRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/order', orderRouter);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err?.message || err);
    process.exit(1);
  }
})();
