const Notification = require('../models/Notification');

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notifications for current user
// @route   GET /api/notifications/unread
// @access  Private
const getUnreadNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user.id,
      isRead: false
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    // Ensure user owns the notification
    if (notification.recipientId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to update this notification');
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      data: { message: 'All notifications marked as read' }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    // Ensure user owns the notification
    if (notification.recipientId.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to delete this notification');
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create a notification (used by other controllers)
const createNotification = async (recipientId, type, title, message, relatedId = null, relatedModel = null) => {
  try {
    const notification = await Notification.create({
      recipientId,
      type,
      title,
      message,
      relatedId,
      relatedModel
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};
