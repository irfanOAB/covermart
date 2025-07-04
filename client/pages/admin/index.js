import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CubeIcon, 
  CurrencyRupeeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';
import axios from 'axios';
import Link from 'next/link';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      products: 0,
      users: 0,
      orders: 0,
      delivered: 0,
      pending: 0,
    },
    revenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    // Get user info from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedUserInfo = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null;
      setUserInfo(storedUserInfo);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/admin/dashboard', config);
        setStats(data);
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

    if (userInfo && userInfo.isAdmin) {
      fetchDashboardStats();
    }
  }, [userInfo]);

  const StatCard = ({ title, value, icon: Icon, color, link }) => (
    <Link href={link} className="block">
      <div className={`bg-white overflow-hidden shadow rounded-lg border-b-4 ${color}`}>
        <div className="p-5 flex items-center">
          <div className={`inline-flex flex-shrink-0 items-center justify-center h-16 w-16 rounded-full ${color.replace('border', 'bg')} bg-opacity-10 mr-6`}>
            <Icon className={`h-8 w-8 ${color.replace('border', 'text')}`} />
          </div>
          <div>
            <span className="block text-2xl font-bold">{value}</span>
            <span className="block text-gray-500">{title}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard | Covermart</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your store performance and recent activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Products"
          value={stats.counts.products}
          icon={CubeIcon}
          color="border-blue-500"
          link="/admin/products"
        />
        <StatCard
          title="Total Users"
          value={stats.counts.users}
          icon={UsersIcon}
          color="border-green-500"
          link="/admin/users"
        />
        <StatCard
          title="Total Orders"
          value={stats.counts.orders}
          icon={ShoppingBagIcon}
          color="border-purple-500"
          link="/admin/orders"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          icon={CurrencyRupeeIcon}
          color="border-yellow-500"
          link="/admin/analytics"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Orders
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <li key={order._id}>
                  <Link href={`/admin/orders/${order._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Order #{order._id.substring(order._id.length - 8)}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.isPaid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </p>
                          <p
                            className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.isDelivered
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.isDelivered ? 'Delivered' : 'Processing'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {order.user ? order.user.name : 'User Deleted'}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>₹{order.totalPrice.toLocaleString()}</p>
                          <p className="ml-4">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No recent orders
              </li>
            )}
          </ul>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all orders
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Low Stock Products
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <li key={product._id}>
                  <Link href={`/admin/products/${product._id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {product.name}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.countInStock === 0
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {product.countInStock === 0
                              ? 'Out of Stock'
                              : `Low Stock: ${product.countInStock}`}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {product.brand} • {product.category}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>₹{product.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No low stock products
              </li>
            )}
          </ul>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link
              href="/admin/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Manage inventory
              <span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Order Status Overview
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-green-50 rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Delivered Orders
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.counts.delivered}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Orders
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.counts.pending}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
