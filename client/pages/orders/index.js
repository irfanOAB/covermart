import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../utils/AuthContext';
import Spinner from '../../components/ui/Spinner';

const OrdersPage = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    // Fetch real orders from the API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Get orders from the API
        const { data } = await api.get('/orders/myorders');
        
        // Generate order numbers if they don't exist
        const ordersWithNumbers = data.map(order => ({
          ...order,
          orderNumber: order.orderNumber || `ORD-${order._id.substring(0, 6).toUpperCase()}`
        }));
        
        setOrders(ordersWithNumbers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Get order status
  const getOrderStatus = (order) => {
    if (order.isDelivered) {
      return {
        label: 'Delivered',
        color: 'green'
      };
    } else if (order.isPaid) {
      return {
        label: 'Processing',
        color: 'blue'
      };
    } else {
      return {
        label: 'Pending Payment',
        color: 'yellow'
      };
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="large" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
              <div className="mt-6">
                <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const status = getOrderStatus(order);
                  return (
                    <li key={order._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <Link href={`/orders/confirmation?orderId=${order._id}`} className="block">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <p className="text-lg font-medium text-gray-900">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                              {status.label}
                            </span>
                            <span className="ml-4 text-gray-500">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center space-x-4">
                          {order.orderItems && order.orderItems.length > 0 && (
                            <>
                              <div className="flex-shrink-0">
                                <div className="h-16 w-16 rounded-md border border-gray-200 overflow-hidden">
                                  <img 
                                    src={order.orderItems[0].image} 
                                    alt={order.orderItems[0].name}
                                    className="h-full w-full object-contain" 
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.orderItems[0].name}
                                  {order.orderItems.length > 1 && ` + ${order.orderItems.length - 1} more item(s)`}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">₹{order.totalPrice.toFixed(2)}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <Link href="/account" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              ← Back to My Account
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
