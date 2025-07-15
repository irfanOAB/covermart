import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../utils/CartContext';
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';
import { API_BASE_URL } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Handle quick add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1,);
  };
  
  // Process image URL to ensure it's properly formatted
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already an absolute URL (starts with http or https), use it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it starts with /uploads, use the backend URL
    if (imageUrl.startsWith('/uploads')) return `${API_BASE_URL.replace('/api', '')}${imageUrl}`;
    // Otherwise, prefix with the backend uploads path
    return `${API_BASE_URL.replace('/api', '')}/uploads/${imageUrl}`;
  };

  // Calculate discount percentage if both price and discountPrice exist
  const discountPercentage = product.discountPrice && 
    Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <motion.div 
      className="group relative bg-dark-200 rounded-lg border border-white/5 overflow-hidden hover:border-accent-500/50 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 p-2">
        {product.featured && (
          <motion.span 
            className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Featured
          </motion.span>
        )}
        {discountPercentage > 0 && (
          <motion.span 
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {discountPercentage}% OFF
          </motion.span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <motion.span 
            className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Only {product.stock} left
          </motion.span>
        )}
        {product.stock === 0 && (
          <motion.span 
            className="bg-dark-100 text-white/70 text-xs font-bold px-2 py-1 rounded backdrop-blur-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Out of Stock
          </motion.span>
        )}
      </div>

      {/* Image with link */}
      <Link href={`/products/${product._id}`} className="block relative">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-dark-300 to-dark-100">
          <OptimizedImage 
            src={product.images && product.images.length > 0 ? processImageUrl(product.images[0]) : null} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            category={product.category}
            productName={product.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        </div>

        {/* Hover overlay with quick actions */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 bg-accent-500 text-white rounded-full text-sm font-medium shadow-lg ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-600'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
          </motion.button>
        </motion.div>
      </Link>

      {/* Product details */}
      <div className="p-4">
        <Link href={`/products/${product._id}`} className="block">
          {/* Phone model */}
          <p className="text-xs text-gray-400 mb-1">
            {product.phoneModel || 'Universal'}
          </p>

          {/* Product name */}
          <h3 className="font-medium text-white mb-1 line-clamp-2 group-hover:text-accent-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating)
                      ? 'text-accent-500'
                      : 'text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center">
            {product.discountPrice ? (
              <>
                <span className="font-semibold text-accent-400">
                  ₹{product.discountPrice.toLocaleString('en-IN')}
                </span>
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="font-semibold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {/* GST info */}
          <p className="text-xs text-gray-500 mt-1">
            Inc. {product.gstRate || 18}% GST
          </p>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
