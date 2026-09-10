import axios from "axios";

const apiOrigin =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const normalizedApiOrigin = apiOrigin.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${normalizedApiOrigin}/api`,
});

export const getMediaUrl = (imagePath) => {
  if (!imagePath) {
    return "";
  }

  // If the image is already a complete URL
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  // Frontend public image mapping
  const imageMap = {
    "images (1).jpeg": "/products/blazer.jpeg",
    "images (2).jpeg": "/products/shoes.jpeg",
    "images (3).jpeg": "/products/sunglasses.jpeg",
    "images (4).jpeg": "/products/watch.jpeg",
  };

  const fileName = decodeURIComponent(imagePath).split("/").pop();

  return imageMap[fileName] || "/products/blazer.jpeg";
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;