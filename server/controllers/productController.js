const Product = require('../models/productModel');
const path = require('path');
const fs = require('fs');

// Fallback mock data for when MongoDB is not connected
const getMockProducts = () => {
  return [
    {
      _id: '1',
      name: 'Premium Silicone Case for iPhone 15 Pro Max',
      images: ['product-1.jpg', 'product-2.jpg', 'product-5.jpg'],
      description: 'A premium quality phone case with military-grade drop protection. Features a sleek design with precise cutouts for all ports and buttons.',
      phoneModel: 'iPhone 15 Pro Max',
      brand: 'CoverMart',
      category: 'Silicone',
      price: 1499,
      discountPrice: 999,
      gstRate: 18,
      countInStock: 15,
      colors: [
        { name: 'Black', hexCode: '#000000', inStock: true },
        { name: 'Blue', hexCode: '#0000FF', inStock: true },
        { name: 'Red', hexCode: '#FF0000', inStock: true }
      ],
      material: 'Silicone',
      features: [
        'Military-grade drop protection',
        'Slim profile design',
        'Wireless charging compatible',
        'Antimicrobial coating',
        'Raised edges for screen protection',
        'Precise cutouts for all ports'
      ],
      rating: 4.5,
      numReviews: 120,
      isFeatured: true
    },
    {
      _id: '2',
      name: 'Leather Wallet Case for iPhone 15 Pro',
      images: ['product-3.jpg', 'product-4.jpg', 'product-2.jpg'],
      description: 'Genuine leather wallet case with card slots and premium stitching. Combines style with functionality.',
      phoneModel: 'iPhone 15 Pro',
      brand: 'CoverMart',
      category: 'Leather',
      price: 1999,
      discountPrice: 1699,
      gstRate: 18,
      countInStock: 8,
      colors: [
        { name: 'Brown', hexCode: '#8B4513', inStock: true },
        { name: 'Black', hexCode: '#000000', inStock: true }
      ],
      material: 'Genuine Leather',
      features: [
        'Genuine leather construction',
        'Three card slots and cash pocket',
        'Magnetic closure',
        'Converts to viewing stand',
        'Full camera protection',
        'Premium stitching details'
      ],
      rating: 4.8,
      numReviews: 85,
      isFeatured: true
    },
    {
      _id: '3',
      name: 'Transparent Case for iPhone 15',
      images: ['product-5.jpg', 'product-1.jpg'],
      description: 'Crystal clear transparent case that shows off your phone\'s design while providing excellent protection.',
      phoneModel: 'iPhone 15',
      brand: 'CoverMart',
      category: 'Transparent',
      price: 999,
      discountPrice: 799,
      gstRate: 18,
      countInStock: 25,
      colors: [
        { name: 'Clear', hexCode: '#FFFFFF', inStock: true },
        { name: 'Smoke', hexCode: '#708090', inStock: true }
      ],
      material: 'TPU and Polycarbonate',
      features: [
        'Crystal clear transparency',
        'Shock-absorbing corners',
        'Non-yellowing material',
        'Slim and lightweight',
        'Raised bezels for screen and camera protection'
      ],
      rating: 4.3,
      numReviews: 67,
      isFeatured: false
    }
  ];
};

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // If MongoDB is connected, proceed with normal database query
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    // Build filter object based on query params
    const filter = {};

    // Phone model filter
    if (req.query.model) {
      filter.phoneModel = req.query.model;
    }

    // Price range filter - use discountPrice if available, otherwise use price
    if (req.query.minPrice || req.query.maxPrice) {
      // Create a $or condition to check both price and discountPrice
      const priceConditions = [];
      
      if (req.query.minPrice && req.query.maxPrice) {
        // Condition 1: discountPrice exists and is within range
        priceConditions.push({
          discountPrice: { 
            $exists: true, 
            $ne: null,
            $gte: Number(req.query.minPrice), 
            $lte: Number(req.query.maxPrice) 
          }
        });
        // Condition 2: discountPrice doesn't exist or is null, but price is within range
        priceConditions.push({
          $or: [
            { discountPrice: { $exists: false } },
            { discountPrice: null }
          ],
          price: { 
            $gte: Number(req.query.minPrice), 
            $lte: Number(req.query.maxPrice) 
          }
        });
      } else if (req.query.minPrice) {
        // Condition 1: discountPrice exists and is >= minPrice
        priceConditions.push({
          discountPrice: { 
            $exists: true, 
            $ne: null,
            $gte: Number(req.query.minPrice) 
          }
        });
        // Condition 2: discountPrice doesn't exist or is null, but price is >= minPrice
        priceConditions.push({
          $or: [
            { discountPrice: { $exists: false } },
            { discountPrice: null }
          ],
          price: { $gte: Number(req.query.minPrice) }
        });
      } else if (req.query.maxPrice) {
        // Condition 1: discountPrice exists and is <= maxPrice
        priceConditions.push({
          discountPrice: { 
            $exists: true, 
            $ne: null,
            $lte: Number(req.query.maxPrice) 
          }
        });
        // Condition 2: discountPrice doesn't exist or is null, but price is <= maxPrice
        priceConditions.push({
          $or: [
            { discountPrice: { $exists: false } },
            { discountPrice: null }
          ],
          price: { $lte: Number(req.query.maxPrice) }
        });
      }
      
      // Add the $or condition to the filter
      filter.$or = priceConditions;
    }

    // Color filter
    if (req.query.color) {
      filter['colors.name'] = req.query.color;
    }

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Search keyword
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Combine all filters
    const finalFilter = { ...filter, ...keyword };

    // Count total products matching the filter
    const count = await Product.countDocuments(finalFilter);

    // Fetch products
    const products = await Product.find(finalFilter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort(req.query.sort ? req.query.sort : '-createdAt');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    res.json({
      products: mockProducts,
      page: 1,
      pages: 1,
      total: mockProducts.length,
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      console.log('MongoDB not connected, using mock data for product details');
      const mockProducts = getMockProducts();
      const product = mockProducts.find(p => p._id === req.params.id);
      
      if (product) {
        return res.json(product);
      } else {
        return res.status(404).json({ message: 'Product not found in mock data' });
      }
    }
    
    // If MongoDB is connected, proceed with normal database query
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error in getProductById:', error);
    
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    const product = mockProducts.find(p => p._id === req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found in mock data' });
    }
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed this product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      console.log('MongoDB not connected, using mock data for featured products');
      const mockProducts = getMockProducts();
      const featured = mockProducts.filter(p => p.isFeatured);
      return res.json(featured);
    }
    
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    const featured = mockProducts.filter(p => p.isFeatured);
    res.json(featured);
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new
// @access  Public
const getNewProducts = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      console.log('MongoDB not connected, using mock data for new products');
      const mockProducts = getMockProducts();
      // For mock data, just return some products as "new"
      const newProducts = mockProducts.slice(0, 8);
      return res.json(newProducts);
    }
    
    // If MongoDB is connected, get the newest products by creation date
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    console.error('Error in getNewProducts:', error);
    
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    const newProducts = mockProducts.slice(0, 8);
    res.json(newProducts);
  }
};

// @desc    Get all product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      console.log('MongoDB not connected, using mock data for categories');
      const mockProducts = getMockProducts();
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return res.json(categories);
    }
    
    // If MongoDB is connected, proceed with normal database query
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error in getCategories:', error);
    
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    const categories = [...new Set(mockProducts.map(p => p.category))];
    res.json(categories);
  }
};

// @desc    Get all phone models
// @route   GET /api/products/models
// @access  Public
const getPhoneModels = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoConnected()) {
      console.log('MongoDB not connected, using mock data for phone models');
      const mockProducts = getMockProducts();
      const models = [...new Set(mockProducts.map(p => p.phoneModel))];
      return res.json(models);
    }
    
    // If MongoDB is connected, proceed with normal database query
    const models = await Product.distinct('phoneModel');
    res.json(models);
  } catch (error) {
    console.error('Error in getPhoneModels:', error);
    
    // Fallback to mock data on error
    const mockProducts = getMockProducts();
    const models = [...new Set(mockProducts.map(p => p.phoneModel))];
    res.json(models);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getNewProducts,
  getProductCategories,
  getPhoneModels,
};
