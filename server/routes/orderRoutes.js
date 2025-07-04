const express = require('express');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  calculateTax,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Calculate GST for an order
router.post('/calculate-tax', calculateTax);

// Create new order
router.route('/').post(protect, createOrder);

// Get user's orders
router.route('/myorders').get(protect, getMyOrders);

// Get order by ID
router.route('/:id').get(protect, getOrderById);

// Update order to paid
router.route('/:id/pay').put(protect, updateOrderToPaid);

module.exports = router;
