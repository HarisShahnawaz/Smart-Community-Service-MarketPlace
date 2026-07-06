const express = require('express');
const {
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
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.route('/stats')
  .get(getAdminStats);

// User management
router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

// Product management
router.route('/products')
  .get(getAllProducts);

router.route('/products/pending')
  .get(getPendingProducts);

router.route('/products/:id/status')
  .put(updateProductStatus);

// Service management
router.route('/services')
  .get(getAllServices);

router.route('/services/pending')
  .get(getPendingServices);

router.route('/services/:id/status')
  .put(updateServiceStatus);

// Booking management
router.route('/bookings')
  .get(getAllBookings);

module.exports = router;
