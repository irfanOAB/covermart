import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import AdminLayout from '../../../components/admin/AdminLayout';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/outline';

const UserEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [password, setPassword] = useState('');

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(`/api/admin/users/${id}`, config);
        setUser({
          name: data.name,
          email: data.email,
          phone: data.phone,
          isAdmin: data.isAdmin,
        });
        setAddresses(data.addresses || []);
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
      fetchUser();
    }
  }, [id, router, userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const updateData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      };

      if (password) {
        updateData.password = password;
      }

      await axios.put(`/api/admin/users/${id}`, updateData, config);
      setSuccess(true);
      setLoading(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>Edit User | Covermart Admin</title>
      </Head>

      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Users
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update user information and permissions
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
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline"> User updated successfully</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={user.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={user.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isAdmin"
                        name="isAdmin"
                        type="checkbox"
                        checked={user.isAdmin}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="isAdmin"
                        className="font-medium text-gray-700"
                      >
                        Administrator
                      </label>
                      <p className="text-gray-500">
                        Grant full administrative privileges to this user
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Addresses */}
            <div className="px-4 py-5 bg-gray-50 sm:p-6 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Addresses
              </h3>
              <div className="mt-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500">No addresses found</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address, index) => (
                      <div
                        key={address._id || index}
                        className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">
                            {address.isDefault ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                                Default
                              </span>
                            ) : null}
                            Address {index + 1}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.street}, {address.city}, {address.state},{' '}
                          {address.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserEdit;
