import api from "./api";

export const getAuthenticatedUserId = () => {
  const accessToken = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");

  if (!accessToken || !userId) {
    return null;
  }

  try {
    const encodedPayload = accessToken
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const payload = JSON.parse(
      atob(encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, "="))
    );
    const isExpired = !payload.exp || payload.exp * 1000 <= Date.now();

    if (isExpired || String(payload.user_id) !== userId) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register/", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login/", credentials);
  return response.data;
};
