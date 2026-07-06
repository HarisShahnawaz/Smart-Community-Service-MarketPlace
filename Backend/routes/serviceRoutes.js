const express = require('express');
const { body } = require('express-validator');
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
  .post(protect, upload.array('images', 5), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('deliveryTimeInDays').isInt({ gt: 0 }).withMessage('Delivery time must be a positive integer'),
    body('category').trim().notEmpty().withMessage('Category is required')
  ], createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, upload.array('images', 5), [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('deliveryTimeInDays').optional().isInt({ gt: 0 }).withMessage('Delivery time must be a positive integer'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty')
  ], updateService)
  .delete(protect, deleteService);

module.exports = router;
