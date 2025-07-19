const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Generate order number
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      orderNumber,
      // Set isPaid to true if payment method is not COD
      isPaid: paymentMethod !== 'cash_on_delivery',
      paidAt: paymentMethod !== 'cash_on_delivery' ? Date.now() : null,
    });

    const createdOrder = await order.save();

    if (!createdOrder) {
      return res.status(400).json({ message: 'Order could not be created' });
    }

    // Return the created order with populated product details
    const populatedOrder = await Order.findById(createdOrder._id).populate(
      'user',
      'name email'
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Calculate GST for an order
// @route   POST /api/orders/calculate-tax
// @access  Public
const calculateTax = async (req, res) => {
  try {
    const { orderItems } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    let totalTax = 0;
    
    // Calculate tax for each product
    for (const item of orderItems) {
      // Default GST rate is 18% if not specified
      const gstRate = item.gstRate || 18;
      const itemTax = (item.price * item.qty * gstRate) / 100;
      totalTax += itemTax;
    }

    res.json({
      taxAmount: totalTax,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  calculateTax,
};
