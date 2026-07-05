const Review = require('../models/Review');
const User = require('../models/User');
const Service = require('../models/Service');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');

// Helper function to recalculate ratings for a target
const recalculateRatings = async (targetId, targetType) => {
  try {
    const reviews = await Review.find({ targetId, targetType });
    
    if (reviews.length === 0) {
      // No reviews, reset ratings to 0
      if (targetType === 'User') {
        await User.findByIdAndUpdate(targetId, { ratingAvg: 0, ratingCount: 0 });
      } else if (targetType === 'Service') {
        await Service.findByIdAndUpdate(targetId, { ratingAvg: 0, ratingCount: 0 });
      } else if (targetType === 'Product') {
        await Product.findByIdAndUpdate(targetId, { ratingAvg: 0, ratingCount: 0 });
      }
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    if (targetType === 'User') {
      await User.findByIdAndUpdate(targetId, { 
        ratingAvg: avgRating.toFixed(1), 
        ratingCount: reviews.length 
      });
    } else if (targetType === 'Service') {
      await Service.findByIdAndUpdate(targetId, { 
        ratingAvg: avgRating.toFixed(1), 
        ratingCount: reviews.length 
      });
    } else if (targetType === 'Product') {
      await Product.findByIdAndUpdate(targetId, { 
        ratingAvg: avgRating.toFixed(1), 
        ratingCount: reviews.length 
      });
    }
  } catch (error) {
    console.error('Error recalculating ratings:', error);
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { targetId, targetType, rating, comment, bookingId } = req.body;

    if (!targetId || !targetType || !rating || !comment) {
      res.status(400);
      throw new Error('Please provide targetId, targetType, rating, and comment');
    }

    if (rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this target
    const existingReview = await Review.findOne({
      reviewerId: req.user.id,
      targetId,
      targetType
    });

    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this item');
    }

    // Verify target exists
    let target;
    if (targetType === 'User') {
      target = await User.findById(targetId);
    } else if (targetType === 'Service') {
      target = await Service.findById(targetId);
    } else if (targetType === 'Product') {
      target = await Product.findById(targetId);
    }

    if (!target) {
      res.status(404);
      throw new Error(`${targetType} not found`);
    }

    // Cannot review yourself
    if (targetType === 'User' && targetId === req.user.id) {
      res.status(400);
      throw new Error('You cannot review yourself');
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      targetId,
      targetType,
      rating,
      comment,
      bookingId
    });

    // Recalculate ratings
    await recalculateRatings(targetId, targetType);

    // Create notification for the reviewed user/seller/provider
    let recipientId;
    if (targetType === 'User') {
      recipientId = targetId;
    } else if (targetType === 'Service') {
      recipientId = target.providerId;
    } else if (targetType === 'Product') {
      recipientId = target.sellerId;
    }

    if (recipientId && recipientId.toString() !== req.user.id) {
      await createNotification(
        recipientId,
        'review',
        'New Review Received',
        `You received a ${rating}-star review`,
        review._id,
        'Review'
      );
    }

    const populatedReview = await Review.findById(review._id)
      .populate('reviewerId', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a target
// @route   GET /api/reviews/:targetType/:targetId
// @access  Public
const getTargetReviews = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;

    if (!['User', 'Service', 'Product'].includes(targetType)) {
      res.status(400);
      throw new Error('Invalid target type');
    }

    const reviews = await Review.find({ targetId, targetType })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews by current user
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewerId: req.user.id })
      .populate('targetId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Only the reviewer can update their own review
    if (review.reviewerId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        res.status(400);
        throw new Error('Rating must be between 1 and 5');
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    // Recalculate ratings
    await recalculateRatings(review.targetId, review.targetType);

    const populatedReview = await Review.findById(review._id)
      .populate('reviewerId', 'name avatar');

    res.status(200).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Only the reviewer can delete their own review
    if (review.reviewerId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const targetId = review.targetId;
    const targetType = review.targetType;

    await review.deleteOne();

    // Recalculate ratings
    await recalculateRatings(targetId, targetType);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getTargetReviews,
  getMyReviews,
  updateReview,
  deleteReview
};
