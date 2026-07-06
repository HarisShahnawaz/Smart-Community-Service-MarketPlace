const express = require('express');
const {
  getUserStats,
  getUserActivity
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/stats')
  .get(getUserStats);

router.route('/activity')
  .get(getUserActivity);

module.exports = router;
