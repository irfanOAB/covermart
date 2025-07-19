"use client";
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../../utils/CartContext';
import { useAuth } from '../../utils/AuthContext';
import Spinner from '../../components/ui/Spinner';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay'
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.discountPrice,
    0
  );
  const gst = subtotal * 0.18;
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + gst + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      router.push('/cart');
    }

    // Pre-fill form with user data if available
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [cartItems, router, user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.pincode) errors.pincode = 'PIN code is required';

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      setError('Please log in to place an order.');
      router.push('/login?redirect=/checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare order items data
      const orderItemsData = cartItems.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.discountPrice,
        product: item._id || item.product
      }));

      // Prepare order data
      const orderData = {
        orderItems: orderItemsData,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'razorpay',
        itemsPrice: subtotal,
        taxPrice: gst,
        shippingPrice: shipping,
        totalPrice: total
      };

      // If payment method is COD, place order directly
      if (formData.paymentMethod === 'cod') {
        // API call to create order
        const response = await api.post('/orders', orderData);
        
        if (response && response.data && response.data._id) {
          handleOrderSuccess(response.data._id);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        // For online payments (Razorpay)
        initiateRazorpayPayment(orderData);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to place your order. Please try again.');
      setLoading(false);
    }
  };

  // Initialize Razorpay payment
  const initiateRazorpayPayment = async (orderData) => {
    try {
      // First create the order in our database
      const orderResponse = await api.post('/orders', orderData);
      
      if (!orderResponse || !orderResponse.data || !orderResponse.data._id) {
        throw new Error('Invalid response from server when creating order');
      }
      
      const orderId = orderResponse.data._id;
      
      // API call to create Razorpay order
      // In a real application, you would create a Razorpay order here
      // const { data } = await api.post('/api/payments/razorpay', {
      //   amount: total,
      //   orderId: orderId
      // });

      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with actual key
        amount: total * 100, // Amount in paise
        currency: 'INR',
        name: 'CoverMart',
        description: 'Payment for your iPhone cover purchase',
        image: '/logo.png',
        order_id: orderResponse.data.orderNumber, // Use our order number as reference
        handler: async function (response) {
          try {
            // Update the order to paid
            const paymentUpdateResponse = await api.put(`/orders/${orderId}/pay`, {
              id: response.razorpay_payment_id,
              status: 'completed',
              update_time: new Date().toISOString(),
              email_address: formData.email
            });
            
            if (paymentUpdateResponse && paymentUpdateResponse.data) {
              handleOrderSuccess(orderId);
            } else {
              throw new Error('Failed to update payment status');
            }
          } catch (error) {
            console.error('Error updating payment status:', error);
            setError('Payment was successful but we could not update your order. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          order_id: orderId
        },
        theme: {
          color: '#7c3aed'
        }
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded');
      }

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  // Handle successful order placement
  const handleOrderSuccess = (paymentId) => {
    setOrderPlaced(true);
    clearCart();
    router.push(`/orders/confirmation?orderId=${paymentId}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit}>
                {/* Shipping Information */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>

                  {error && (
                    <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="razorpay"
                        name="paymentMethod"
                        type="radio"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                        Pay Online (Credit/Debit Card, UPI, Netbanking)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="cod"
                        name="paymentMethod"
                        type="radio"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery (COD)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300 disabled:cursor-not-allowed"
                  >
                    {loading ? <Spinner size="small" color="white" /> : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

              <div className="flow-root mb-6">
                <ul className="-my-4 divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item._id || item.product} className="flex py-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3 className="line-clamp-1">{item.name}</h3>
                            <p className="ml-4">₹{(item.discountPrice * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{item.phoneModel}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">GST (18%)</dt>
                  <dd className="font-medium text-gray-900">₹{gst.toFixed(2)}</dd>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </dd>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  By placing your order, you agree to our{' '}
                  <Link href="/terms" className="font-medium text-purple-600 hover:text-purple-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-purple-600 hover:text-purple-500">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
