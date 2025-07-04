const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        color: { type: String },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
    sessionId: {
      type: String, // For guest users (non-logged in)
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Cart expires after 30 days if not checked out
      expires: 2592000,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
