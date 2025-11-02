import axios from "axios";

const base = `${import.meta.env.VITE_API_URL}/api` || "/api";

export const api = axios.create({ baseURL: base });

api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
