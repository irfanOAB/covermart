const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Razorpay API key
router.get('/razorpay/key', getRazorpayKey);

// Create Razorpay order
router.post('/razorpay', protect, createRazorpayOrder);

// Verify Razorpay payment
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;
