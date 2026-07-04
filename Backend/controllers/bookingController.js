const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create a booking for a service
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { serviceId, message, scheduledDate } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }

    if (!service.availability) {
      res.status(400);
      throw new Error('This service is currently unavailable for booking');
    }

    // Prevent provider from booking their own service
    if (service.providerId.toString() === req.user.id) {
      res.status(400);
      throw new Error('You cannot book your own service');
    }

    const booking = await Booking.create({
      service: serviceId,
      client: req.user.id,
      provider: service.providerId,
      message,
      scheduledDate,
      totalPrice: service.price
    });

    await booking.populate([
      { path: 'service', select: 'title price' },
      { path: 'client', select: 'name avatar' },
      { path: 'provider', select: 'name avatar' }
    ]);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the current user (as client or provider)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const { role } = req.query; // 'client' or 'provider'
    
    let query = {};
    if (role === 'provider') {
      query.provider = req.user.id;
    } else {
      // Default: client's own bookings
      query.client = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('service', 'title price portfolioImages')
      .populate('client', 'name avatar')
      .populate('provider', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title price portfolioImages description')
      .populate('client', 'name avatar email contactNumber')
      .populate('provider', 'name avatar email contactNumber');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Only the client or provider can view the booking
    if (
      booking.client._id.toString() !== req.user.id &&
      booking.provider._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (provider accepts/rejects, client cancels)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const isClient = booking.client.toString() === req.user.id;
    const isProvider = booking.provider.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Permission checks
    if (!isClient && !isProvider && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this booking');
    }

    // Provider can accept, reject, or complete
    if (isProvider && !['accepted', 'rejected', 'completed'].includes(status)) {
      res.status(400);
      throw new Error('Provider can only set status to: accepted, rejected, completed');
    }

    // Client can only cancel their own pending booking
    if (isClient && status !== 'cancelled') {
      res.status(400);
      throw new Error('Client can only cancel a booking');
    }

    if (isClient && booking.status !== 'pending') {
      res.status(400);
      throw new Error('Only pending bookings can be cancelled');
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: `Booking ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus
};
