const express = require('express');
const {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getProductCategories,
  getPhoneModels,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all products with filtering, pagination
router.get('/', getProducts);

// Get top rated products
router.route('/top').get(getTopProducts);

// Get featured products
router.route('/featured').get(getFeaturedProducts);

// Get product categories
router.route('/categories').get(getProductCategories);

// Get phone models
router.route('/models').get(getPhoneModels);

// Get single product by ID
router.route('/:id').get(getProductById);

// Create product review
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
