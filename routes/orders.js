const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Create an order (Customer)
router.post('/', protect, authorize('customer'), orderController.createOrder);

// Get MY orders (Customer)
router.get('/my-orders', protect, authorize('customer'), orderController.getMyOrders);

// Admin: Get all orders
router.get('/', protect, authorize('admin'), orderController.getAllOrders);

// Admin: Update order status
router.put('/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

module.exports = router;
