const Product = require('../models/Product');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const User = require('../models/User');

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/stats
// @access  Privates
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get counts
    const [
      productCount,
      serviceCount,
      bookingCount,
      reviewReceivedCount,
      reviewGivenCount,
      favoriteCount
    ] = await Promise.all([
      Product.countDocuments({ sellerId: userId }),
      Service.countDocuments({ providerId: userId }),
      Booking.countDocuments({ userId }),
      Review.countDocuments({ targetId: userId, targetType: 'User' }),
      Review.countDocuments({ reviewerId: userId }),
      Favorite.countDocuments({ userId })
    ]);

    // Get booking status breakdown
    const bookingStatusBreakdown = await Booking.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ userId })
      .populate('serviceId', 'title price')
      .populate('providerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent reviews received
    const recentReviews = await Review.find({ targetId: userId, targetType: 'User' })
      .populate('reviewerId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get product status breakdown
    const productStatusBreakdown = await Product.aggregate([
      { $match: { sellerId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get service status breakdown
    const serviceStatusBreakdown = await Service.aggregate([
      { $match: { providerId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get user's average rating
    const user = await User.findById(userId);
    const avgRating = user.ratingAvg || 0;
    const totalReviews = user.ratingCount || 0;

    res.status(200).json({
      success: true,
      data: {
        counts: {
          products: productCount,
          services: serviceCount,
          bookings: bookingCount,
          reviewsReceived: reviewReceivedCount,
          reviewsGiven: reviewGivenCount,
          favorites: favoriteCount
        },
        rating: {
          average: avgRating,
          total: totalReviews
        },
        bookingStatusBreakdown: bookingStatusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        productStatusBreakdown: productStatusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        serviceStatusBreakdown: serviceStatusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentBookings,
        recentReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's recent activity
// @route   GET /api/dashboard/activity
// @access  Private
const getUserActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    // Get recent products
    const recentProducts = await Product.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent services
    const recentServices = await Service.find({ providerId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent bookings
    const recentBookings = await Booking.find({ userId })
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Get recent reviews given
    const recentReviews = await Review.find({ reviewerId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Combine and sort by date
    const activity = [
      ...recentProducts.map(item => ({ ...item.toObject(), type: 'product' })),
      ...recentServices.map(item => ({ ...item.toObject(), type: 'service' })),
      ...recentBookings.map(item => ({ ...item.toObject(), type: 'booking' })),
      ...recentReviews.map(item => ({ ...item.toObject(), type: 'review' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.status(200).json({
      success: true,
      count: activity.length,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserStats,
  getUserActivity
};
