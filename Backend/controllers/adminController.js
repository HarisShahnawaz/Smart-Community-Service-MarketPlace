const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getAdminStats = async (req, res, next) => {
  try {
    const [
      userCount,
      productCount,
      serviceCount,
      bookingCount,
      reviewCount,
      pendingProducts,
      pendingServices
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Service.countDocuments({ status: 'pending' })
    ]);

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          products: productCount,
          services: serviceCount,
          bookings: bookingCount,
          reviews: reviewCount,
          pendingProducts,
          pendingServices
        },
        recentUsers,
        recentBookings
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or suspend user
// @route   PUT /api/admin/users/:id
// @access  Admin
const updateUser = async (req, res, next) => {
  try {
    const { role, isSuspended } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (role) user.role = role;
    if (typeof isSuspended === 'boolean') user.isSuspended = isSuspended;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      res.status(400);
      throw new Error('Cannot delete your own account');
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending products
// @route   GET /api/admin/products/pending
// @access  Admin
const getPendingProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ status: 'pending' })
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject product
// @route   PUT /api/admin/products/:id/status
// @access  Admin
const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.status = status;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending services
// @route   GET /api/admin/services/pending
// @access  Admin
const getPendingServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find({ status: 'pending' })
        .populate('providerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject service
// @route   PUT /api/admin/services/:id/status
// @access  Admin
const updateServiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    service.status = status;
    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (for admin)
// @route   GET /api/admin/products
// @access  Admin
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('sellerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all services (for admin)
// @route   GET /api/admin/services
// @access  Admin
const getAllServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};

    const [services, total] = await Promise.all([
      Service.find(query)
        .populate('providerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (for admin)
// @route   GET /api/admin/bookings
// @access  Admin
const getAllBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('userId', 'name email')
        .populate('serviceId', 'title')
        .populate('providerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getPendingProducts,
  updateProductStatus,
  getPendingServices,
  updateServiceStatus,
  getAllProducts,
  getAllServices,
  getAllBookings
};
