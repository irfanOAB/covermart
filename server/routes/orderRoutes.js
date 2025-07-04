const express = require('express');
const {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    calculateTax,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { calculateTaxSchema, createOrderSchema } = require('../validations/orderValidation');

const router = express.Router();

router.post('/calculate-tax', validate(calculateTaxSchema), calculateTax);
router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;