const express = require('express');
const {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getMyNotifications);

router.route('/unread')
  .get(getUnreadNotifications);

router.route('/unread-count')
  .get(getUnreadCount);

router.route('/read-all')
  .put(markAllAsRead);

router.route('/:id/read')
  .put(markAsRead);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;
