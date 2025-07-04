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
const validate = require('../middleware/validateMiddleware');
const { reviewSchema } = require('../validations/productValidation');

const router = express.Router();

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getProductCategories);
router.get('/models', getPhoneModels);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, validate(reviewSchema), createProductReview);

module.exports = router;