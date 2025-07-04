import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import AdminLayout from '../../../components/admin/AdminLayout';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';

const OrderDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/admin/orders/${id}`, config);
        setOrder(data);
        if (data.trackingInfo) {
          setTrackingNumber(data.trackingInfo.number || '');
          setTrackingUrl(data.trackingInfo.url || '');
        }
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, router, userInfo]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'MMM dd, yyyy, h:mm a');
  };

  const handleMarkAsPaid = async () => {
    try {
      setUpdatingStatus(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/admin/orders/${id}/pay`,
        {},
        config
      );
      
      // Update order in state
      setOrder({
        ...order,
        isPaid: true,
        paidAt: new Date().toISOString(),
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUpdatingStatus(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdatingStatus(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      setUpdatingStatus(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const trackingData = {
        trackingInfo: {
          number: trackingNumber,
          url: trackingUrl,
        },
      };

      await axios.put(
        `/api/admin/orders/${id}/deliver`,
        trackingData,
        config
      );
      
      // Update order in state
      setOrder({
        ...order,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
        trackingInfo: {
          number: trackingNumber,
          url: trackingUrl,
        },
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUpdatingStatus(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdatingStatus(false);
    }
  };

  const handleUpdateTracking = async () => {
    try {
      setUpdatingStatus(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const trackingData = {
        trackingInfo: {
          number: trackingNumber,
          url: trackingUrl,
        },
      };

      await axios.put(
        `/api/admin/orders/${id}`,
        trackingData,
        config
      );
      
      // Update order in state
      setOrder({
        ...order,
        trackingInfo: {
          number: trackingNumber,
          url: trackingUrl,
        },
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUpdatingStatus(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdatingStatus(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Order Details | Covermart Admin</title>
      </Head>

      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage order information
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : order ? (
        <div>
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> Order updated successfully</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.isDelivered
                        ? 'bg-green-100 text-green-800'
                        : order.isPaid
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.isDelivered
                      ? 'Delivered'
                      : order.isPaid
                      ? 'Paid, Processing'
                      : 'Payment Pending'}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Customer</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.user ? (
                        <>
                          <div>{order.user.name}</div>
                          <div className="text-gray-500">{order.user.email}</div>
                          {order.user.phone && <div>{order.user.phone}</div>}
                        </>
                      ) : (
                        'Guest User'
                      )}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.shippingAddress ? (
                        <>
                          <div>{order.shippingAddress.street}</div>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                            {order.shippingAddress.pincode}
                          </div>
                        </>
                      ) : (
                        'No shipping address provided'
                      )}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.paymentMethod}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.isPaid ? (
                        <span className="text-green-600">
                          Paid on {formatDate(order.paidAt)}
                        </span>
                      ) : (
                        <span className="text-red-600">Not Paid</span>
                      )}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Delivery Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {order.isDelivered ? (
                        <span className="text-green-600">
                          Delivered on {formatDate(order.deliveredAt)}
                        </span>
                      ) : (
                        <span className="text-yellow-600">Not Delivered</span>
                      )}
                    </dd>
                  </div>
                  {order.trackingInfo && order.trackingInfo.number && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tracking Info</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div>Number: {order.trackingInfo.number}</div>
                        {order.trackingInfo.url && (
                          <div>
                            <a
                              href={order.trackingInfo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Track Package
                            </a>
                          </div>
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Order Actions</h3>
                <div className="mt-5">
                  {!order.isPaid && (
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={handleMarkAsPaid}
                        disabled={updatingStatus}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                      >
                        {updatingStatus ? 'Processing...' : 'Mark as Paid'}
                      </button>
                    </div>
                  )}

                  {order.isPaid && !order.isDelivered && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Mark Order as Delivered
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="trackingNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tracking Number
                          </label>
                          <input
                            type="text"
                            name="trackingNumber"
                            id="trackingNumber"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="trackingUrl"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tracking URL
                          </label>
                          <input
                            type="text"
                            name="trackingUrl"
                            id="trackingUrl"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleMarkAsDelivered}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                        >
                          {updatingStatus ? 'Processing...' : 'Mark as Delivered'}
                        </button>
                      </div>
                    </div>
                  )}

                  {order.isDelivered && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Update Tracking Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="trackingNumber"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tracking Number
                          </label>
                          <input
                            type="text"
                            name="trackingNumber"
                            id="trackingNumber"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="trackingUrl"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tracking URL
                          </label>
                          <input
                            type="text"
                            name="trackingUrl"
                            id="trackingUrl"
                            value={trackingUrl}
                            onChange={(e) => setTrackingUrl(e.target.value)}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleUpdateTracking}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                        >
                          {updatingStatus ? 'Processing...' : 'Update Tracking'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              {item.color && (
                                <div className="text-sm text-gray-500">
                                  Color: {item.color}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.qty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{(item.qty * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="border-t border-gray-200 pt-4">
                <dl className="divide-y divide-gray-200">
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹{order.itemsPrice.toLocaleString()}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹{order.shippingPrice.toLocaleString()}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Tax</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      ₹{order.taxPrice.toLocaleString()}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between">
                    <dt className="text-lg font-bold text-gray-900">Total</dt>
                    <dd className="text-lg font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Note:</strong>
          <span className="block sm:inline"> Order not found</span>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderDetail;
