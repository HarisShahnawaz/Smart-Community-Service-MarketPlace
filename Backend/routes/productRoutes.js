const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, upload.array('images', 5), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('condition').isIn(['new', 'used']).withMessage('Condition must be new or used'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ], createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, upload.array('images', 5), [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
    body('condition').optional().isIn(['new', 'used']).withMessage('Condition must be new or used'),
    body('location').optional().trim().notEmpty().withMessage('Location cannot be empty')
  ], updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
