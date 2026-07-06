import api from './axios';

// Get admin dashboard stats
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data.data;
};

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  const response = await api.get(`/admin/users?${params}`);
  return response.data;
};

// Update user role or suspend user
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/admin/users/${userId}`, userData);
  return response.data.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data.data;
};

// Get pending products
export const getPendingProducts = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/products/pending?page=${page}&limit=${limit}`);
  return response.data;
};

// Approve or reject product
export const updateProductStatus = async (productId, status) => {
  const response = await api.put(`/admin/products/${productId}/status`, { status });
  return response.data.data;
};

// Get pending services
export const getPendingServices = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/services/pending?page=${page}&limit=${limit}`);
  return response.data;
};

// Approve or reject service
export const updateServiceStatus = async (serviceId, status) => {
  const response = await api.put(`/admin/services/${serviceId}/status`, { status });
  return response.data.data;
};

// Get all products (for admin)
export const getAllProducts = async (page = 1, limit = 10, status = '') => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  const response = await api.get(`/admin/products?${params}`);
  return response.data;
};

// Get all services (for admin)
export const getAllServices = async (page = 1, limit = 10, status = '') => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  const response = await api.get(`/admin/services?${params}`);
  return response.data;
};

// Get all bookings (for admin)
export const getAllBookings = async (page = 1, limit = 10) => {
  const response = await api.get(`/admin/bookings?page=${page}&limit=${limit}`);
  return response.data;
};
