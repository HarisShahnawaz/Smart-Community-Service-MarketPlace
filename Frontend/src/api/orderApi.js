import api from './axios';

// Create a new order
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data.data;
};

// Get purchases (orders where user is buyer)
export const getMyPurchases = async () => {
  const response = await api.get('/orders/my-purchases');
  return response.data.data;
};

// Get sales (orders where user is seller)
export const getMySales = async () => {
  const response = await api.get('/orders/my-sales');
  return response.data.data;
};

// Update order status (seller or admin only)
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data.data;
};
