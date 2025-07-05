import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../utils/CartContext';
import api from '../../utils/api';
import Spinner from '../../components/ui/Spinner';
import OptimizedImage from '../../components/ui/OptimizedImage';

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  // Helper function to generate mock product data as fallback
  const getMockProduct = (id) => {
    // Define a set of mock products with backend URLs for images
    const mockProducts = [
      {
        _id: '1',
        name: 'Premium Phone Case',
        price: 1499,
        discountPrice: 999,
        rating: 4.5,
        numReviews: 120,
        countInStock: 15,
        category: 'Cases',
        phoneModel: 'iPhone 15 Pro Max',
        description: 'A premium quality phone case with military-grade drop protection. Features a sleek design with precise cutouts for all ports and buttons.',
        images: [
          'http://localhost:5000/uploads/product-1.jpg',
          'http://localhost:5000/uploads/product-2.jpg',
          'http://localhost:5000/uploads/product-5.jpg'
        ],
        isNew: true,
        isBestSeller: true,
        features: [
          'Military-grade drop protection',
          'Slim profile design',
          'Wireless charging compatible',
          'Antimicrobial coating',
          'Raised edges for screen protection',
          'Precise cutouts for all ports'
        ],
        specifications: {
          'Material': 'Polycarbonate and TPU',
          'Drop Protection': 'Up to 12 feet',
          'Weight': '35 grams',
          'Thickness': '2.2mm',
          'Warranty': '1 year manufacturer warranty'
        }
      },
      {
        _id: '2',
        name: 'Leather Wallet Case',
        price: 1999,
        discountPrice: 1699,
        rating: 4.8,
        numReviews: 85,
        countInStock: 8,
        category: 'Cases',
        phoneModel: 'iPhone 15 Pro',
        description: 'Genuine leather wallet case with card slots and premium stitching. Combines style with functionality.',
        images: [
          'http://localhost:5000/uploads/product-3.jpg',
          'http://localhost:5000/uploads/product-4.jpg',
          'http://localhost:5000/uploads/product-6.jpg'
        ],
        isNew: false,
        isBestSeller: true,
        features: [
          'Genuine leather construction',
          'Three card slots and cash pocket',
          'Magnetic closure',
          'Converts to viewing stand',
          'Full camera protection',
          'Premium stitching details'
        ],
        specifications: {
          'Material': 'Genuine leather and microfiber',
          'Card Slots': '3',
          'Weight': '48 grams',
          'Thickness': '3.5mm',
          'Warranty': '2 year manufacturer warranty'
        }
      }
    ];
    
    // Try to find a mock product with matching ID
    const mockProduct = mockProducts.find(p => p._id === id);
    
    // If found, return it, otherwise return the first mock product
    return mockProduct || mockProducts[0];
  };
  
  // Process image URL to ensure it's properly formatted
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already an absolute URL (starts with http or https), use it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // If it starts with /uploads, use the backend URL
    if (imageUrl.startsWith('/uploads')) return `http://localhost:5000${imageUrl}`;
    
    // Otherwise, prefix with the backend uploads path
    return `http://localhost:5000/uploads/${imageUrl}`;
  };

  // Fetch product data
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Fetch from backend API
        const response = await api.get(`/products/${id}`);
        const productData = response.data;
        
        // Process image URLs for API data
        if (productData.images) {
          productData.images = productData.images.map(img => processImageUrl(img));
        }
        
        setProduct(productData);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to mock data if API fails
        const mockProduct = getMockProduct(id);
        // Process image URLs
        if (mockProduct.images) {
          mockProduct.images = mockProduct.images.map(img => processImageUrl(img));
        }
        setProduct(mockProduct);
        setError('Could not fetch product from API, using mock data instead');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.countInStock || 10)) {
      setQuantity(value);
    }
  };
  
  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < (product?.countInStock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      await addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || product.price,
        image: product.images[0],
        phoneModel: product.phoneModel,
        category: product.category,
        quantity,
        countInStock: product.countInStock
      });
      
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
    
    setAddingToCart(false);
  };

  // Buy now handler
  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push('/cart');
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This product does not exist or has been removed.'}</p>
          <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex mb-5 text-sm font-medium">
          <Link href="/" className="text-gray-400 hover:text-accent-400">
            Home
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <Link href="/products" className="text-gray-400 hover:text-accent-400">
            Products
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-white">{product.name}</span>
        </nav>
        
        <div className="bg-dark-200 rounded-lg shadow-lg border border-dark-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="flex flex-col">
              <div className="relative h-80 sm:h-96 w-full mb-4 rounded-lg overflow-hidden border border-dark-100 bg-dark-200">
                {product.images && product.images.length > 0 ? (
                  <OptimizedImage
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    category={product.category}
                    productName={product.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-dark-100 text-white/70">
                    <OptimizedImage
                      src={null}
                      alt={product.name}
                      fill
                      className="object-contain"
                      category={product.category}
                      productName={product.name}
                    />
                  </div>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 rounded border-2 ${
                        selectedImage === index ? 'border-accent-500' : 'border-dark-100'
                      } overflow-hidden bg-dark-200`}
                    >
                      <OptimizedImage
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        category={product.category}
                        productName={product.name}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="flex flex-col">
              {/* Title and badges */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  {product.isNew && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-900 text-amber-200">
                      Best Seller
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2">{product.name}</h1>
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-accent-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating) ? 'text-accent-400' : 'text-dark-100'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-400">
                  {product.rating} ({product.numReviews} reviews)
                </p>
              </div>
              
              {/* Price */}
              <div className="mb-4">
                {product.discountPrice && product.discountPrice < product.price ? (
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-white">
                      ₹{(product.discountPrice || 0).toFixed(2)}
                    </p>
                    <p className="ml-2 text-base line-through text-gray-500">
                      ₹{(product.price || 0).toFixed(2)}
                    </p>
                    <p className="ml-2 text-sm text-accent-400">
                      {Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}% off
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-white">₹{(product.price || 0).toFixed(2)}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  Inclusive of all taxes
                </p>
              </div>
              
              {/* Phone model & category */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Phone Model</p>
                  <p className="font-medium text-white">{product.phoneModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Category</p>
                  <p className="font-medium text-white">{product.category}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="font-medium text-white mb-2">Description</h3>
                <div className="prose text-sm text-gray-300">
                  <p>{product.description}</p>
                </div>
              </div>
              
              {/* Stock status */}
              <div className="mb-4">
                {product.countInStock > 0 ? (
                  <p className="text-accent-400 text-sm font-medium">
                    In Stock ({product.countInStock} available)
                  </p>
                ) : (
                  <p className="text-red-400 text-sm font-medium">Out of Stock</p>
                )}
              </div>
              
              {/* Quantity selector */}
              {product.countInStock > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-white mb-1">
                    Quantity
                  </label>
                  <div className="flex">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 border border-dark-100 bg-dark-100 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      min="1"
                      max={product.countInStock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-16 border-t border-b border-dark-100 bg-dark-100 text-white text-center focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 border border-dark-100 bg-dark-100 text-white rounded-r-md focus:outline-none focus:ring-1 focus:ring-accent-500"
                      disabled={quantity >= product.countInStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-auto">
                <button
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0 || addingToCart}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? <Spinner size="small" color="white" /> : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.countInStock === 0 || addingToCart}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Features */}
          <div className="border-t border-dark-100 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-accent-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No features specified</li>
              )}
            </ul>
          </div>
          
          {/* Specifications */}
          <div className="border-t border-dark-100 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Specifications</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {product.specifications && Object.entries(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-400">{key}</dt>
                    <dd className="mt-1 text-sm text-white">{value}</dd>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-gray-500">No specifications available</div>
              )}
            </dl>
          </div>
        </div>
      </div>
      
      {/* Added to cart notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
          <svg
            className="h-5 w-5 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Added to cart!</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-4 text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
