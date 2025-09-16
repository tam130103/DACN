import axios from "axios";

const BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:4000").trim();

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,        // 60s để chờ Render “wake up”
  withCredentials: false,
  headers: { Accept: "application/json" },
});

export const authHeader = (token) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

export const API_BASE_URL = BASE_URL;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || err.message;
    console.error(`[API ${status || "ERR"}] ${msg}`);
    return Promise.reject(err);
  }
);
