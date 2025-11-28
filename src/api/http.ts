// src/api/http.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const http = axios.create({
  baseURL,
});

// minden kérésre rakjon JWT-t, ha van
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
