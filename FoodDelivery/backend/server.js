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

// ------- CORS -------
const allowlist = [
  process.env.FRONTEND_URL,      // ví dụ: https://dacn-three.vercel.app
  process.env.ADMIN_URL,         // ví dụ: https://dacn-admin.vercel.app
  process.env.FRONTEND_URL_ALT,  // tuỳ chọn thêm domain khác nếu có
  'http://localhost:5173',       // Vite dev
  'http://localhost:3000'        // CRA dev
].filter(Boolean);

const vercelHostRegex = /\.vercel\.app$/; // cho phép preview của Vercel

const corsOptions = {
  origin(origin, cb) {
    // Cho phép request không có origin (Postman/cURL, health checks)
    if (!origin) return cb(null, true);

    try {
      const u = new URL(origin);
      const ok =
        allowlist.some(a => origin.startsWith(a)) ||
        vercelHostRegex.test(u.hostname);

      return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`), false);
    } catch {
      return cb(new Error(`CORS invalid origin: ${origin}`), false);
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
// xử lý preflight sớm (nhất là với form-data/authorization)
app.options('*', cors(corsOptions));

// ------- Body & static -------
app.use(express.json());
app.use('/images', express.static('uploads', {
  maxAge: '1d',
  etag: true
}));

// Health check
app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/', (_, res) => res.send('API Working'));

// ------- Routes sau khi DB sẵn sàng -------
(async () => {
  try {
    await connectDB();
    console.log('✅ Mongo connected');

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
