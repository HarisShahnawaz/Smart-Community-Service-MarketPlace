const express = require('express');
const {
  createReview,
  getTargetReviews,
  getMyReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route to get reviews for a target
router.get('/:targetType/:targetId', getTargetReviews);

// All other routes require authentication
router.use(protect);

router.route('/')
  .post(createReview);

router.route('/my-reviews')
  .get(getMyReviews);

router.route('/:id')
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
