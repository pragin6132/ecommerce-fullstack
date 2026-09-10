import api from "./api";

export const addToCart = async (productId, userId) => {
  const response = await api.post("/cart/add/", {
    product_id: productId,
    user_id: userId,
  });

  return response.data;
};

export const getCart = async (userId) => {
  const response = await api.get(`/cart/${userId}/`);
  return response.data;
};

export const updateCartItem = async (itemId, quantity, userId) => {
  const response = await api.patch(`/cart/items/${itemId}/`, {
    quantity,
    user_id: userId,
  });

  return response.data;
};

export const removeCartItem = async (itemId, userId) => {
  const response = await api.delete(`/cart/items/${itemId}/`, {
    data: { user_id: userId },
  });

  return response.data;
};
