const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);
        // Find user by email
        const user = await User.findOne({ email });

        console.log('User found:', user);

        console.log(await user.matchPassword(password), "Hello")


        if (user && (await user.matchPassword(password))) {

            console.log('User authenticated successfully', user);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                preferredLanguage: user.preferredLanguage,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            phone,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                preferredLanguage: user.preferredLanguage,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin,
                addresses: user.addresses,
                preferredLanguage: user.preferredLanguage,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                isAdmin: updatedUser.isAdmin,
                preferredLanguage: updatedUser.preferredLanguage,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add address to user profile
// @route   POST /api/users/address
// @access  Private
const addUserAddress = async(req, res) => {
    try {
        const { street, city, state, pincode, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            // If new address is default, set all others to false
            if (isDefault) {
                user.addresses.forEach(address => {
                    address.isDefault = false;
                });
            }

            // Add new address
            user.addresses.push({
                street,
                city,
                state,
                pincode,
                isDefault: isDefault || false,
            });

            // If this is the first address, set it as default
            if (user.addresses.length === 1) {
                user.addresses[0].isDefault = true;
            }

            await user.save();

            res.status(201).json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user address
// @route   PUT /api/users/address/:id
// @access  Private
const updateUserAddress = async(req, res) => {
    try {
        const { street, city, state, pincode, isDefault } = req.body;

        const user = await User.findById(req.user._id);

        if (user) {
            const addressIndex = user.addresses.findIndex(
                (a) => a._id.toString() === req.params.id
            );

            if (addressIndex === -1) {
                return res.status(404).json({ message: 'Address not found' });
            }

            // If new address is default, set all others to false
            if (isDefault) {
                user.addresses.forEach(address => {
                    address.isDefault = false;
                });
            }

            // Update address
            user.addresses[addressIndex] = {
                ...user.addresses[addressIndex],
                street: street || user.addresses[addressIndex].street,
                city: city || user.addresses[addressIndex].city,
                state: state || user.addresses[addressIndex].state,
                pincode: pincode || user.addresses[addressIndex].pincode,
                isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault,
            };

            await user.save();

            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteUserAddress = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const addressIndex = user.addresses.findIndex(
                (a) => a._id.toString() === req.params.id
            );

            if (addressIndex === -1) {
                return res.status(404).json({ message: 'Address not found' });
            }

            // Check if removing the default address
            const wasDefault = user.addresses[addressIndex].isDefault;

            // Remove address
            user.addresses.splice(addressIndex, 1);

            // If the removed address was default and there are other addresses,
            // set the first one as default
            if (wasDefault && user.addresses.length > 0) {
                user.addresses[0].isDefault = true;
            }

            await user.save();

            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
};