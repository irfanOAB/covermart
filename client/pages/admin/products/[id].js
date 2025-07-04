import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import AdminLayout from '../../../components/admin/AdminLayout';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon, XIcon } from '@heroicons/react/outline';

const ProductEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const isNewProduct = id === 'new';

  const [product, setProduct] = useState({
    name: '',
    brand: '',
    category: '',
    phoneModel: '',
    description: '',
    price: 0,
    discountPrice: 0,
    countInStock: 0,
    colors: [],
    features: [],
    images: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  // For adding new colors and features
  const [newColor, setNewColor] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  // Categories for dropdown
  const categories = [
    'Phone Cases',
    'Screen Protectors',
    'Chargers',
    'Cables',
    'Power Banks',
    'Headphones',
    'Speakers',
    'Accessories',
  ];

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      router.push('/login');
      return;
    }

    if (!isNewProduct && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          };

          const { data } = await axios.get(`/api/admin/products/${id}`, config);
          setProduct(data);
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

      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [id, router, userInfo, isNewProduct]);

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

      if (isNewProduct) {
        await axios.post('/api/admin/products', product, config);
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/products');
        }, 2000);
      } else {
        await axios.put(`/api/admin/products/${id}`, product, config);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct({
      ...product,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleAddColor = () => {
    if (newColor.trim() && !product.colors.includes(newColor.trim())) {
      setProduct({
        ...product,
        colors: [...product.colors, newColor.trim()],
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setProduct({
      ...product,
      colors: product.colors.filter((color) => color !== colorToRemove),
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !product.features.includes(newFeature.trim())) {
      setProduct({
        ...product,
        features: [...product.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove) => {
    setProduct({
      ...product,
      features: product.features.filter((feature) => feature !== featureToRemove),
    });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    setUploadError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/admin/upload', formData, config);

      setProduct({
        ...product,
        images: [...product.images, data],
      });
      setUploadingImage(false);
    } catch (error) {
      setUploadError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error uploading image'
      );
      setUploadingImage(false);
    }
  };

  const removeImage = (imageUrl) => {
    setProduct({
      ...product,
      images: product.images.filter((image) => image !== imageUrl),
    });
  };

  return (
    <AdminLayout>
      <Head>
        <title>
          {isNewProduct ? 'Add New Product' : 'Edit Product'} | Covermart Admin
        </title>
      </Head>

      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isNewProduct ? 'Add New Product' : 'Edit Product'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isNewProduct
            ? 'Create a new product listing'
            : 'Update product information, pricing, and inventory'}
        </p>
      </div>

      {loading && !uploadingImage ? (
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
              <span className="block sm:inline">
                {' '}
                Product {isNewProduct ? 'created' : 'updated'} successfully
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={product.name}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={product.brand}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={product.category}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="phoneModel"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Compatible Phone Model *
                  </label>
                  <input
                    type="text"
                    name="phoneModel"
                    id="phoneModel"
                    value={product.phoneModel}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min="0"
                    step="0.01"
                    value={product.price}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="discountPrice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    id="discountPrice"
                    min="0"
                    step="0.01"
                    value={product.discountPrice}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label
                    htmlFor="countInStock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock Count *
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    id="countInStock"
                    min="0"
                    value={product.countInStock}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={product.description}
                    onChange={handleChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  ></textarea>
                </div>

                {/* Colors Section */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Colors
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{color}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(color)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Add a color"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="mt-1 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Features Section */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Features
                  </label>
                  <div className="space-y-2 mb-3">
                    {product.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
                      >
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md rounded-r-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="mt-1 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-32 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        accept="image/*"
                      />
                      {uploadingImage && (
                        <div className="ml-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                        </div>
                      )}
                    </div>
                    {uploadError && (
                      <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                {loading ? 'Saving...' : isNewProduct ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductEdit;
