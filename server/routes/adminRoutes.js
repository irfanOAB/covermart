const express = require('express');
const {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadProductImages,
  getOrders,
  updateOrderToDelivered,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }, // 5MB limit
});

const router = express.Router();

// All admin routes are protected by both 'protect' and 'admin' middleware
// Product management routes
router.route('/products')
  .get(protect, admin, getProducts)
  .post(protect, admin, createProduct);

router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Image upload route
router.post('/upload', protect, admin, upload.array('images', 5), uploadProductImages);

// Order management routes
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id/deliver', protect, admin, updateOrderToDelivered);

// Dashboard statistics
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;
