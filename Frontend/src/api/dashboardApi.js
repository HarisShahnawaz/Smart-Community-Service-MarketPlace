import api from './axios';

// Get user dashboard stats
export const getUserStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data.data;
};

// Get user recent activity
export const getUserActivity = async (limit = 10) => {
  const response = await api.get(`/dashboard/activity?limit=${limit}`);
  return response.data.data;
};
