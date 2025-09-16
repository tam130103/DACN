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

/* -------------------- CORS (so sánh theo hostname) -------------------- */
// Cho phép các origin cụ thể + mọi preview *.vercel.app
const RAW_ALLOWED = [
  process.env.FRONTEND_URL,     // ví dụ: https://dacn-three.vercel.app
  process.env.ADMIN_URL,        // ví dụ: https://dacn-rfwb.vercel.app
  process.env.FRONTEND_URL_ALT, // tùy chọn
  'http://localhost:5173',      // Vite dev
  'http://localhost:3000',      // CRA dev
].filter(Boolean);

// Rút thành tập hostnames (không phụ thuộc http/https hay dấu '/')
const ALLOWED_HOSTS = RAW_ALLOWED.reduce((set, u) => {
  try { set.add(new URL(u).hostname); } catch {}
  return set;
}, new Set());

const isVercelHost = (hostname) => /\.vercel\.app$/i.test(hostname);

const corsOptions = {
  origin(origin, cb) {
    // Cho phép request không có origin (Postman/cURL/healthz)
    if (!origin) return cb(null, true);
    try {
      const { hostname } = new URL(origin);
      const ok = ALLOWED_HOSTS.has(hostname) || isVercelHost(hostname);
      return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`), false);
    } catch {
      return cb(new Error(`CORS invalid origin: ${origin}`), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// ⚠️ Express 5: KHÔNG dùng '*' nữa (gây lỗi path-to-regexp). Dùng '(.*)' hoặc '/*' nếu cần.
app.options('(.*)', cors(corsOptions)); // xử lý preflight cho mọi path

/* -------------------- Body & static -------------------- */
app.use(express.json());
app.use('/images', express.static('uploads', { maxAge: '1d', etag: true }));

/* -------------------- Health check -------------------- */
app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/',       (_, res) => res.send('API Working'));

/* -------------------- Routes sau khi DB sẵn sàng -------------------- */
(async () => {
  try {
    await connectDB(); // dùng đúng ENV (ví dụ: MONGODB_URL)
    console.log('✅ Mongo connected');

    app.use('/api/food',  foodRouter);
    app.use('/api/user',  userRouter);
    app.use('/api/cart',  cartRouter);
    app.use('/api/order', orderRouter);

    // Quan trọng với Render: bind 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err?.message || err);
    process.exit(1);
  }
})();
