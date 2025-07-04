const express = require('express');
const {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validations/userValidation');

const router = express.Router();

// Register a new user
router.post('/register', validate(registerSchema), registerUser);

// Login user
router.post('/login', validate(loginSchema), loginUser);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Address routes
router.post('/address', protect, addUserAddress);
router.put('/address/:id', protect, updateUserAddress);
router.delete('/address/:id', protect, deleteUserAddress);

module.exports = router;