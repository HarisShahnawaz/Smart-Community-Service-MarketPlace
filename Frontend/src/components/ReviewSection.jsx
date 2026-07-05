import { useState, useEffect } from 'react';
import { Star, StarHalf, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { getTargetReviews, createReview, updateReview, deleteReview } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ targetType, targetId, targetOwnerId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [targetType, targetId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getTargetReviews(targetType, targetId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await updateReview(editingReview._id, formData);
      } else {
        await createReview({
          targetId,
          targetType,
          ...formData
        });
      }
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({ rating: review.rating, comment: review.comment });
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setFormData({ rating: 5, comment: '' });
  };

  const canReview = user && targetOwnerId && user.id !== targetOwnerId;

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  const renderInteractiveStars = (rating, onRatingChange) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onRatingChange(i)}
          className="hover:scale-110 transition-transform"
        >
          <Star 
            className={`w-6 h-6 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        </button>
      );
    }
    return stars;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Reviews
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">
              {renderStars(Math.round(calculateAverageRating()))}
            </div>
            <span className="text-gray-600">
              {calculateAverageRating()} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
        {canReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">
            {editingReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {renderInteractiveStars(formData.rating, (rating) => 
                setFormData({ ...formData, rating })
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Share your experience..."
              required
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.comment.length}/1000</p>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                  {review.reviewerId?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {review.reviewerId?.name || 'Anonymous'}
                      </h4>
                      <div className="flex mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    {user && review.reviewerId?._id === user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-gray-400 hover:text-teal-600 transition-colors"
                          title="Edit review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatTime(review.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
