const express = require('express');
const {
  toggleFavorite,
  getMyFavorites,
  checkFavorite
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All favorite routes require authentication
router.use(protect);

router.route('/')
  .get(getMyFavorites);

router.route('/toggle')
  .post(toggleFavorite);

router.route('/check/:itemType/:itemId')
  .get(checkFavorite);

module.exports = router;
