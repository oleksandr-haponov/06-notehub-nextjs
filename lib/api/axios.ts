import axios, { AxiosHeaders } from "axios";

const isServer = typeof window === "undefined";

// На сервере нужен абсолютный origin; в браузере — относительный /api
const origin = isServer
  ? (process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
  : "";

const api = axios.create({
  baseURL: `${origin}/api`,
  headers: new AxiosHeaders({ "Content-Type": "application/json" }),
});

// Проставляем/убираем Authorization безопасно через AxiosHeaders
api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const headers = new AxiosHeaders(config.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.delete("Authorization");
  }

  config.headers = headers;
  return config;
});

export default api;
