// FoodDelivery/admin/src/api/client.js
import axios from "axios";

// Lấy API URL từ ENV (set trên Vercel). Fallback localhost khi dev.
const BASE_URL =
  import.meta.env?.VITE_API_URL?.trim?.() || "http://localhost:4000";

// Tạo axios instance dùng chung cho Admin
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,           // 20s
  withCredentials: false,   // đổi true nếu backend dùng cookie/session
  headers: {
    // "Content-Type" sẽ được axios set tự động.
    // Với FormData, axios sẽ tự set multipart boundary, KHÔNG ép "multipart/form-data" ở đây.
    Accept: "application/json",
  },
});

// Helper header cho Bearer token (nếu bạn bật phân quyền admin sau này)
export const authHeader = (token) => {
  if (!token) return {};
  return { headers: { Authorization: `Bearer ${token}` } };
};

// (Tuỳ chọn) Interceptors: log lỗi/ngắt request
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Ghi log ngắn gọn cho dễ debug
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err.message;
    console.error(`[API ${status || "ERR"}] ${msg}`);
    return Promise.reject(err);
  }
);

// Export thêm baseURL nếu cần hiển thị/diagnostics
export const API_BASE_URL = BASE_URL;
