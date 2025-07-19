  const mongoose = require('mongoose');

  const reviewSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 0, max: 5 },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  );

  const productSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      images: [
        {
          type: String,
          required: true,
        },
      ],
      description: {
        type: String,
        required: true,
      },
      phoneModel: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      discountPrice: {
        type: Number,
        default: 0,
      },
      gstRate: {
        type: Number,
        required: true,
        default: 18, // Default GST rate in percentage
      },
      countInStock: {
        type: Number,
        required: true,
        default: 0,
      },
      colors: [
        {
          name: { type: String },
          hexCode: { type: String },
          inStock: { type: Boolean, default: true },
        },
      ],
      material: {
        type: String,
      },
      features: [
        {
          type: String,
        },
      ],
      reviews: [reviewSchema],
      rating: {
        type: Number,
        required: true,
        default: 0,
      },
      numReviews: {
        type: Number,
        required: true,
        default: 0,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  const Product = mongoose.model('Product', productSchema);

  module.exports = Product;
