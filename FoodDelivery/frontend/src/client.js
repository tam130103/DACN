// src/api/client.js
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL backend trên Render
  // Nếu dùng cookie để login thì bật dòng dưới
  // withCredentials: true,
});
