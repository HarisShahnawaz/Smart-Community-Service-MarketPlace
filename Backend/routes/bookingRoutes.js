const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

router.route('/')
  .get(getMyBookings)
  .post(createBooking);

router.route('/:id')
  .get(getBookingById);

router.route('/:id/status')
  .put(updateBookingStatus);

module.exports = router;
