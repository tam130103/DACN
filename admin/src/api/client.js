import axios from "axios";

const BASE_URL = (import.meta.env?.VITE_API_URL || "http://localhost:4000").trim();
const ADMIN_API_KEY = import.meta.env?.VITE_ADMIN_API_KEY || "";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    ...(ADMIN_API_KEY ? { "x-admin-api-key": ADMIN_API_KEY } : {}),
  },
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
