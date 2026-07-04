import api from './axios';

// Get or create a conversation with another user
export const getOrCreateConversation = async (recipientId) => {
  const response = await api.post('/messages/conversations', { recipientId });
  return response.data.data;
};

// Get all conversations for current user
export const getMyConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data.data;
};

// Get all messages in a conversation
export const getMessages = async (conversationId) => {
  const response = await api.get(`/messages/conversations/${conversationId}`);
  return response.data.data;
};

// Send a message in a conversation
export const sendMessage = async (conversationId, text) => {
  const response = await api.post(`/messages/conversations/${conversationId}`, { text });
  return response.data.data;
};

// Get unread message count for current user
export const getUnreadCount = async () => {
  const response = await api.get('/messages/unread-count');
  return response.data.data.count;
};
