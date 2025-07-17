import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../../utils/CartContext';
import { useAuth } from '../../utils/AuthContext';
import Spinner from '../../components/ui/Spinner';
import OptimizedImage from '../../components/ui/OptimizedImage';

const CartPage = () => {
  const { cartItems, updateCartItemQty, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  console.log(cartItems);

  const [updating, setUpdating] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Process image URL to ensure it's properly formatted
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's already an absolute URL (starts with http or https), use it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path starting with /images, use it as is
    if (imageUrl.startsWith('/images')) return imageUrl;
    // If it's a relative path without leading slash, add the proper prefix
    if (!imageUrl.startsWith('/')) return `/images/products/${imageUrl}`;
    // Otherwise, use as is (it's already a proper path)
    return imageUrl;
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.quantity || item.qty || 1) * (item.discountPrice || item.price || 0),
    0
  );

  // Calculate GST (18%)
  const gst = subtotal * 0.18;

  // Calculate shipping (free for orders over ₹499)
  const shipping = subtotal > 499 ? 0 : 49;

  // Calculate total
  const total = subtotal + gst + shipping;

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1 || (item.countInStock && quantity > item.countInStock)) return;

    setUpdating(true);
    await updateCartItemQty(item._id || item.product, quantity);
    setUpdating(false);
  };

  // Helper function to get the current quantity of an item
  const getItemQuantity = (item) => {
    return item.quantity || item.qty || 1;
  };

  const handleRemoveItem = async (itemId) => {
    setItemToRemove(itemId);
    await removeFromCart(itemId);
    setItemToRemove(null);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-dark-200 p-8 rounded-lg shadow-lg border border-dark-100 text-center">
            <svg
              className="mx-auto h-16 w-16 text-accent-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-lg font-medium text-white mt-4 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-accent-600 hover:bg-accent-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.product}
                  className="bg-dark-200 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row border border-dark-100"
                >
                  {/* Product Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-dark-100 mr-0 sm:mr-6 mb-4 sm:mb-0 mx-auto sm:mx-0 bg-dark-300 relative">
                    <OptimizedImage
                      src={processImageUrl(item?.image)}
                      alt={item.name}
                      fill
                      className="object-contain object-center"
                      category={item.category}
                      productName={item.name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="text-base font-medium text-white">
                          <Link href={`/products/${item._id || item.product}`} className="hover:text-accent-400">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">Model: {item.phoneModel}</p>
                        <p className="mt-1 text-sm text-gray-400">Category: {item.category}</p>
                      </div>

                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-base font-medium text-white">
                          ₹{(item.discountPrice || item.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-accent-400">
                          x{getItemQuantity(item)} = ₹{((item.discountPrice || item.price) * getItemQuantity(item)).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 items-end justify-between text-sm mt-4">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item._id || item.product}`} className="mr-2 text-gray-300">
                          Qty
                        </label>
                        <div className="flex border border-dark-100 rounded bg-dark-300">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, getItemQuantity(item) - 1)}
                            disabled={getItemQuantity(item) <= 1 || updating}
                            className="px-2 py-1 text-white hover:bg-dark-100 focus:outline-none disabled:text-gray-600 disabled:cursor-not-allowed"
                          >
                            -
                          </button>
                          <input
                            id={`quantity-${item._id || item.product}`}
                            type="number"
                            min="1"
                            max={item.countInStock || 10}
                            value={getItemQuantity(item)}
                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                            className="w-12 text-center border-x border-dark-100 bg-dark-300 text-white focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item, getItemQuantity(item) + 1)}
                            disabled={(item.countInStock && getItemQuantity(item) >= item.countInStock) || updating}
                            className="px-2 py-1 text-white hover:bg-dark-100 focus:outline-none disabled:text-gray-600 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item._id || item.product)}
                          disabled={itemToRemove === (item._id || item.product)}
                          className="font-medium text-accent-500 hover:text-accent-400 flex items-center"
                        >
                          {itemToRemove === (item._id || item.product) ? (
                            <Spinner size="small" color="accent" />
                          ) : (
                            <>
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart actions */}
              <div className="flex justify-between border-t border-dark-100 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className="text-sm font-medium text-accent-500 hover:text-accent-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-medium text-red-500 hover:text-red-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-dark-200 rounded-lg shadow-lg p-6 border border-dark-100">
                <h2 className="text-lg font-medium text-white mb-4">Order Summary</h2>

                <div className="flow-root">
                  <dl className="-my-4 text-sm divide-y divide-dark-100">
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-300">Subtotal</dt>
                      <dd className="font-medium text-white">₹{(subtotal || 0).toFixed(2)}</dd>
                    </div>

                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-300">GST (18%)</dt>
                      <dd className="font-medium text-white">₹{(gst || 0).toFixed(2)}</dd>
                    </div>

                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-300">Shipping</dt>
                      <dd className="font-medium text-white">
                        {shipping === 0 ? (
                          <span className="text-green-500">Free</span>
                        ) : (
                          `₹${(shipping || 0).toFixed(2)}`
                        )}
                      </dd>
                    </div>

                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-white">Order Total</dt>
                      <dd className="text-base font-medium text-accent-400">₹{(total || 0).toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-accent-600 border border-transparent rounded-md shadow-lg py-3 px-4 text-base font-medium text-white hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:bg-dark-100 disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>

                {subtotal > 0 && shipping === 0 && (
                  <div className="mt-4 text-center text-sm text-green-500">
                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free shipping on orders over ₹499
                  </div>
                )}

                <div className="mt-6 border-t border-dark-100 pt-4">
                  <h3 className="text-sm font-medium text-white mb-2">Accepted Payment Methods</h3>
                  <div className="flex space-x-2">
                    <div className="h-8 w-12 bg-dark-100 rounded flex items-center justify-center text-xs text-white">
                      Razorpay
                    </div>
                    <div className="h-8 w-12 bg-dark-100 rounded flex items-center justify-center text-xs text-white">
                      UPI
                    </div>
                    <div className="h-8 w-12 bg-dark-100 rounded flex items-center justify-center text-xs text-white">
                      Card
                    </div>
                    <div className="h-8 w-12 bg-dark-100 rounded flex items-center justify-center text-xs text-white">
                      COD
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
