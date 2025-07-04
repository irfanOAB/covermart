const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = async (req, res) => {
  try {
    let cart;

    if (req.user) {
      // Logged in user
      cart = await Cart.findOne({ user: req.user._id })
        .populate('cartItems.product', 'name images price countInStock');
    } else {
      // Guest user with sessionId
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required for guest user' });
      }
      cart = await Cart.findOne({ sessionId })
        .populate('cartItems.product', 'name images price countInStock');
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Public/Private
const addToCart = async (req, res) => {
  try {
    const { productId, qty, color, sessionId } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product is in stock
    if (product.countInStock < qty) {
      return res.status(400).json({ message: 'Product out of stock' });
    }

    // Check if color is available
    if (color && product.colors.length > 0) {
      const colorExists = product.colors.find(c => c.name === color && c.inStock);
      if (!colorExists) {
        return res.status(400).json({ message: 'Selected color not available' });
      }
    }

    let cart;

    // Find or create cart based on user authentication status
    if (req.user) {
      // Logged in user
      cart = await Cart.findOne({ user: req.user._id });
      
      if (!cart) {
        cart = new Cart({
          user: req.user._id,
          cartItems: [],
        });
      }
    } else {
      // Guest user with sessionId
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required for guest user' });
      }
      
      cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        cart = new Cart({
          sessionId,
          cartItems: [],
        });
      }
    }

    // Check if item already exists in cart
    const existItem = cart.cartItems.find(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (existItem) {
      // Update quantity
      existItem.qty = qty;
    } else {
      // Add new item
      cart.cartItems.push({
        product: productId,
        name: product.name,
        image: product.images[0],
        price: product.price,
        color,
        qty,
      });
    }

    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Public/Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, qty, sessionId } = req.body;

    let cart;

    // Find cart based on user authentication status
    if (req.user) {
      // Logged in user
      cart = await Cart.findOne({ user: req.user._id });
    } else {
      // Guest user with sessionId
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required for guest user' });
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item to update
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update quantity or remove if qty is 0
    if (qty <= 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      cart.cartItems[itemIndex].qty = qty;
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Public/Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sessionId } = req.body;

    let cart;

    // Find cart based on user authentication status
    if (req.user) {
      // Logged in user
      cart = await Cart.findOne({ user: req.user._id });
    } else {
      // Guest user with sessionId
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required for guest user' });
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove item from cart
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public/Private
const clearCart = async (req, res) => {
  try {
    const { sessionId } = req.body;

    let cart;

    // Find cart based on user authentication status
    if (req.user) {
      // Logged in user
      cart = await Cart.findOne({ user: req.user._id });
    } else {
      // Guest user with sessionId
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required for guest user' });
      }
      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear cart items
    cart.cartItems = [];
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Merge guest cart with user cart after login
// @route   POST /api/cart/merge
// @access  Private
const mergeGuestCart = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Get guest cart
    const guestCart = await Cart.findOne({ sessionId });

    if (!guestCart || guestCart.cartItems.length === 0) {
      return res.status(404).json({ message: 'Guest cart not found or empty' });
    }

    // Get or create user cart
    let userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      userCart = new Cart({
        user: req.user._id,
        cartItems: [],
      });
    }

    // Merge cart items
    for (const guestItem of guestCart.cartItems) {
      const existItem = userCart.cartItems.find(
        (item) => 
          item.product.toString() === guestItem.product.toString() && 
          item.color === guestItem.color
      );

      if (existItem) {
        // Update quantity
        existItem.qty += guestItem.qty;
      } else {
        // Add new item
        userCart.cartItems.push(guestItem);
      }
    }

    // Save user cart
    await userCart.save();

    // Delete guest cart
    await Cart.findOneAndDelete({ sessionId });

    res.json(userCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save cart for later
// @route   POST /api/cart/save
// @access  Private
const saveCartForLater = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Cart name is required' });
    }

    // Get current cart
    const currentCart = await Cart.findOne({ user: req.user._id });

    if (!currentCart || currentCart.cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart not found or empty' });
    }

    // Create a new cart object with saved name
    const savedCart = new Cart({
      user: req.user._id,
      cartItems: currentCart.cartItems,
      savedName: name,
      isSaved: true,
    });

    await savedCart.save();

    res.status(201).json(savedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeGuestCart,
  saveCartForLater,
};
