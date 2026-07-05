import api from './axios';

// Create a new review
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data.data;
};

// Get reviews for a target
export const getTargetReviews = async (targetType, targetId) => {
  const response = await api.get(`/reviews/${targetType}/${targetId}`);
  return response.data.data;
};

// Get reviews by current user
export const getMyReviews = async () => {
  const response = await api.get('/reviews/my-reviews');
  return response.data.data;
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data.data;
};
