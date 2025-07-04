const express = require('express');
const { check } = require('express-validator');
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

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('phone', 'Please enter a valid Indian phone number').matches(/^[6-9]\d{9}$/),
  ],
  registerUser
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// Get user profile
router.get('/profile', protect, getUserProfile);

// Update user profile
router.put('/profile', protect, updateUserProfile);

// Address routes
router.post('/address', protect, addUserAddress);
router.put('/address/:id', protect, updateUserAddress);
router.delete('/address/:id', protect, deleteUserAddress);

module.exports = router;
