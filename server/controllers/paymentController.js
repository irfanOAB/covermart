const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt, currency = 'INR' } = req.body;

    // Amount should be in paisa (smallest currency unit)
    const options = {
      amount: amount * 100, // Convert to paisa
      currency,
      receipt,
      payment_capture: 1, // Auto-capture
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).json({ message: 'Error creating Razorpay order' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment server error' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating hmac object 
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);

    // Passing the data to be hashed
    hmac.update(`${orderCreationId}|${razorpayPaymentId}`);
    
    // Creating the hmac in the required format
    const generatedSignature = hmac.digest('hex');

    // Verifying the signature
    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order status in database
    const order = await Order.findById(orderCreationId);
    
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpayPaymentId,
        status: 'COMPLETED',
        update_time: Date.now(),
      };

      const updatedOrder = await order.save();
      
      res.json({
        message: 'Payment verified successfully',
        order: updatedOrder,
      });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification error' });
  }
};

// @desc    Get Razorpay key for frontend
// @route   GET /api/payments/razorpay/key
// @access  Public
const getRazorpayKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
};
