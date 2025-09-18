// FoodDelivery/backend/server.js
import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 10000;

/* -------------------- CORS -------------------- */
// Cho phép các domain cụ thể + preview *.vercel.app
const allowlist = [
  process.env.FRONTEND_URL, // ví dụ: https://dacn-three.vercel.app
  process.env.ADMIN_URL,    // ví dụ: https://dacn-admin.vercel.app
  process.env.FRONTEND_URL_ALT, // nếu có
  "http://localhost:5173",  // Vite dev
  "http://localhost:3000"   // CRA dev
].filter(Boolean);

const vercelHostRegex  = /\.vercel\.app$/i;
const renderHostRegex  = /\.onrender\.com$/i;

const corsMw = cors({
  origin(origin, cb) {
    // Cho phép script/health-check không có Origin (Postman/cURL/Render healthz)
    if (!origin) return cb(null, true);

    try {
      const ok =
        allowlist.some((u) => origin.startsWith(u)) ||
        vercelHostRegex.test(new URL(origin).hostname) ||  // preview Vercel
        renderHostRegex.test(new URL(origin).hostname);    // domain Render (tuỳ nhu cầu)

      return ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`));
    } catch {
      return cb(new Error(`CORS invalid origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // Quan trọng: cho phép các header mà frontend gửi (đặc biệt 'token')
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  // Có thể phơi bày thêm header nếu cần:
  exposedHeaders: ["Content-Type"],
  maxAge: 86400 // cache preflight 1 ngày
});

// Áp dụng CORS + preflight
app.use(corsMw);
app.options(/.*/, corsMw); // preflight cho mọi route

/* -------------------- Common middlewares -------------------- */
app.use(express.json());
app.use("/images", express.static("uploads", { maxAge: "1d", etag: true }));

/* -------------------- Health check -------------------- */
app.get("/healthz", (_req, res) => res.status(200).send("ok"));
app.get("/", (_req, res) => res.send("API Working"));

/* -------------------- Start after DB ready -------------------- */
(async () => {
  try {
    await connectDB();
    console.log("✅ Mongo connected");

    // API routes
    app.use("/api/food",  foodRouter);
    app.use("/api/user",  userRouter);
    app.use("/api/cart",  cartRouter);
    app.use("/api/order", orderRouter);

    // Bind 0.0.0.0 để Render lắng nghe
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err?.message || err);
    process.exit(1);
  }
})();
