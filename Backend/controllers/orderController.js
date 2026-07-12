const Order = require('../models/Order');
const Product = require('../models/Product');
const { createNotification } = require('./notificationController');

// Helper to push socket.io notification in real-time
const sendRealTimeNotification = (req, recipientId, notification) => {
  const io = req.app.get('io');
  const onlineUsers = req.app.get('onlineUsers');
  if (io && onlineUsers) {
    const socketId = onlineUsers.get(recipientId.toString());
    if (socketId) {
      io.to(socketId).emit('receive_notification', notification);
    }
  }
};

// @desc    Create a new order (buyer only)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity = 1, shippingAddress, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.status !== 'active') {
      res.status(400);
      throw new Error('Product is no longer available for purchase');
    }

    if (product.sellerId.toString() === req.user.id) {
      res.status(400);
      throw new Error('You cannot buy your own product');
    }

    const totalPrice = product.price * quantity;

    // Create the order
    const order = await Order.create({
      productId,
      buyerId: req.user.id,
      sellerId: product.sellerId,
      quantity,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });

    // Mark product as sold
    product.status = 'sold';
    await product.save();

    // Create a database notification for the seller
    const notification = await createNotification(
      product.sellerId,
      'order',
      'New Order Received',
      `You have received a new order for "${product.title}" from ${req.user.name}`,
      order._id,
      'Order'
    );

    // Push notification via socket in real-time
    if (notification) {
      sendRealTimeNotification(req, product.sellerId, notification);
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders where logged-in user is the buyer
// @route   GET /api/orders/my-purchases
// @access  Private
const getMyPurchases = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('productId', 'title price images condition category')
      .populate('sellerId', 'name avatar email contactNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders where logged-in user is the seller
// @route   GET /api/orders/my-sales
// @access  Private
const getMySales = async (req, res, next) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id })
      .populate('productId', 'title price images condition category')
      .populate('buyerId', 'name avatar email contactNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (seller or admin only)
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid order status');
    }

    const order = await Order.findById(orderId).populate('productId', 'title');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if seller or admin
    const isSeller = order.sellerId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isSeller && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this order status');
    }

    order.status = status;

    // If order is cancelled, we might want to release the product back to active
    if (status === 'cancelled') {
      await Product.findByIdAndUpdate(order.productId._id, { status: 'active' });
    }

    await order.save();

    // Create a database notification for the buyer
    const notification = await createNotification(
      order.buyerId,
      'order',
      'Order Status Updated',
      `Your order for "${order.productId.title}" has been updated to "${status}"`,
      order._id,
      'Order'
    );

    // Push notification via socket in real-time
    if (notification) {
      sendRealTimeNotification(req, order.buyerId, notification);
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyPurchases,
  getMySales,
  updateOrderStatus
};
