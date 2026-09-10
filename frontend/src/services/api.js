import axios from "axios";

const apiOrigin = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const normalizedApiOrigin = apiOrigin.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${normalizedApiOrigin}/api`,
});

export const getMediaUrl = (imagePath) => {
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${normalizedApiOrigin}${normalizedPath}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
