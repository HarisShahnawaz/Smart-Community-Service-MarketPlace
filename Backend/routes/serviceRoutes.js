const express = require('express');
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, upload.array('images', 5), createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, upload.array('images', 5), updateService)
  .delete(protect, deleteService);

module.exports = router;
