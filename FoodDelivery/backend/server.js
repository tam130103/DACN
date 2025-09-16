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

// ---- CORS (mở để debug) ----
const corsMw = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);       // Postman/healthz…
    return cb(null, true);                    // mở tất cả origin
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 86400,
});

app.use(corsMw);
// ❌ app.options('(.*)', corsMw);
app.options('*', corsMw);                     // ✅ Express 5 chấp nhận

// ---- Body & Static ----
app.use(express.json());
app.use('/images', express.static('uploads', { maxAge: '1d', etag: true }));

// ---- Health ----
app.get('/healthz', (_, res) => res.status(200).send('ok'));
app.get('/', (_, res) => res.send('API Working'));

// ---- Start ----
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
