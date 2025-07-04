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
const validate = require('../middleware/validateMiddleware');
const { productSchema } = require('../validations/adminValidation');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb('Images only!');
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const router = express.Router();

router
    .route('/products')
    .get(protect, admin, getProducts)
    .post(protect, admin, validate(productSchema), createProduct);

router
    .route('/products/:id')
    .put(protect, admin, validate(productSchema), updateProduct)
    .delete(protect, admin, deleteProduct);

router.post('/upload', protect, admin, upload.array('images', 5), uploadProductImages);
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id/deliver', protect, admin, updateOrderToDelivered);
router.get('/dashboard', protect, admin, getDashboardStats);

module.exports = router;