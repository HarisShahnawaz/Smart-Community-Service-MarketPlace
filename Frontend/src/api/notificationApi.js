import api from './axios';

// Get all notifications for current user
export const getMyNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data;
};

// Get unread notifications for current user
export const getUnreadNotifications = async () => {
  const response = await api.get('/notifications/unread');
  return response.data.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data.count;
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data.data;
};
