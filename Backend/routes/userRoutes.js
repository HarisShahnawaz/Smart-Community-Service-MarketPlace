const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  getUserById
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), updateUserProfile);

router.get('/:id', getUserById);

module.exports = router;
