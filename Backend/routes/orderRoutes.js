const express = require('express');
const {
  createOrder,
  getMyPurchases,
  getMySales,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/my-purchases', getMyPurchases);
router.get('/my-sales', getMySales);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
