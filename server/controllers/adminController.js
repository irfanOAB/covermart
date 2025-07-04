const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Product.countDocuments();
    const products = await Product.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort('-createdAt');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Delete product images from storage if they exist
      for (const image of product.images) {
        const imagePath = path.join(__dirname, '..', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      brand,
      category,
      phoneModel,
      countInStock,
      discountPrice,
      gstRate,
      colors,
      material,
      features,
    } = req.body;

    // Validate required fields
    if (!name || !price || !description || !brand || !category || !phoneModel || !countInStock) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create product with sample image (will be replaced after upload)
    const product = new Product({
      name,
      price,
      images: ['/uploads/sample.jpg'],
      description,
      brand,
      category,
      phoneModel,
      countInStock,
      discountPrice: discountPrice || 0,
      gstRate: gstRate || 18,
      colors: colors || [],
      material: material || '',
      features: features || [],
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      phoneModel,
      countInStock,
      discountPrice,
      gstRate,
      colors,
      material,
      features,
      isFeatured,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images || product.images;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.phoneModel = phoneModel || product.phoneModel;
      product.countInStock = countInStock || product.countInStock;
      product.discountPrice = discountPrice || product.discountPrice;
      product.gstRate = gstRate || product.gstRate;
      product.colors = colors || product.colors;
      product.material = material || product.material;
      product.features = features || product.features;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload product images
// @route   POST /api/admin/upload
// @access  Private/Admin
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
    res.json(uploadedImages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments();
    const orders = await Order.find({})
      .populate('user', 'id name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort('-createdAt');

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/admin/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // Add tracking information if provided
      if (req.body.trackingInfo) {
        order.trackingInfo = req.body.trackingInfo;
      }

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

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.countDocuments();

    // Total users
    const totalUsers = await User.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Orders statistics
    const deliveredOrders = await Order.countDocuments({ isDelivered: true });
    const pendingOrders = totalOrders - deliveredOrders;

    // Total revenue
    const revenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

    // Recent orders (last 10)
    const recentOrders = await Order.find({})
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);

    // Product stock levels
    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } })
      .limit(10);

    res.json({
      counts: {
        products: totalProducts,
        users: totalUsers,
        orders: totalOrders,
        delivered: deliveredOrders,
        pending: pendingOrders,
      },
      revenue: totalRevenue,
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProductImages,
  getOrders,
  updateOrderToDelivered,
  getDashboardStats,
};
