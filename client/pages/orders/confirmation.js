import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../utils/AuthContext';
import Spinner from '../../components/ui/Spinner';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { isAuthenticated } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  
  useEffect(() => {
    if (!orderId) return;
    
    // In a real application, we would fetch order details from the API
    // For now, we'll create a mock order
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order details
        const mockOrder = {
          _id: orderId,
          orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          totalPrice: 1299.00,
          shippingAddress: {
            name: 'Demo User',
            address: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            phone: '9876543210'
          },
          paymentMethod: orderId.startsWith('COD') ? 'cod' : 'razorpay',
          isPaid: !orderId.startsWith('COD'),
          paidAt: !orderId.startsWith('COD') ? new Date().toISOString() : null,
          isDelivered: false,
          estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          orderItems: [
            {
              name: 'Premium Silicone iPhone 15 Pro Cover',
              image: 'https://via.placeholder.com/300',
              price: 699.00,
              quantity: 1,
              phoneModel: 'iPhone 15 Pro'
            },
            {
              name: 'Transparent Shock Proof Case',
              image: 'https://via.placeholder.com/300',
              price: 599.00,
              quantity: 1,
              phoneModel: 'iPhone 15'
            }
          ]
        };
        
        setOrderDetails(mockOrder);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="large" />
      </div>
    );
  }
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Order Confirmation Header */}
          <div className="bg-green-50 p-6 text-center border-b border-green-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-green-700 mt-1">Thank you for your purchase.</p>
          </div>
          
          {/* Order Details */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Order #{orderDetails.orderNumber}</h2>
                <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(orderDetails.createdAt)}</p>
              </div>
              <Link href="/orders" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                View all orders
              </Link>
            </div>
            
            {/* Order Status */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      orderDetails.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orderDetails.isPaid ? 'Paid' : 'Pending'}
                    </span>
                    {orderDetails.isPaid && (
                      <span className="ml-2 text-sm text-gray-500">{formatDate(orderDetails.paidAt)}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Delivery Status</h3>
                  <div className="mt-1 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {orderDetails.isDelivered ? 'Delivered' : 'Processing'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {orderDetails.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(orderDetails.estimatedDeliveryDate)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-2">Shipping Address</h3>
              <address className="not-italic text-sm text-gray-600">
                <p>{orderDetails.shippingAddress.name}</p>
                <p>{orderDetails.shippingAddress.address}</p>
                <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} - {orderDetails.shippingAddress.pincode}</p>
                <p>Phone: {orderDetails.shippingAddress.phone}</p>
              </address>
            </div>
            
            {/* Order Items */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900 mb-4">Order Items</h3>
              <ul className="divide-y divide-gray-200">
                {orderDetails.orderItems.map((item, index) => (
                  <li key={index} className="py-4 flex">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h4>{item.name}</h4>
                        <p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex justify-between text-sm text-gray-500">
                        <p>Model: {item.phoneModel}</p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Order Summary */}
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">Order Summary</h3>
              <dl className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <dt>Subtotal</dt>
                  <dd>₹{(orderDetails.totalPrice * 0.85).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <dt>GST (18%)</dt>
                  <dd>₹{(orderDetails.totalPrice * 0.15).toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <dt>Shipping</dt>
                  <dd>Free</dd>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-3 border-t border-gray-200">
                  <dt>Total</dt>
                  <dd>₹{orderDetails.totalPrice.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/" className="inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Continue Shopping
            </Link>
            <Link href="/contact" className="inline-flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
