import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../utils/api';
import ProductCard from '../../components/products/ProductCard';
import Spinner from '../../components/ui/Spinner';
import { motion } from 'framer-motion';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    phoneModel: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  const [categories, setCategories] = useState([]);
  const [phoneModels, setPhoneModels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    // Initialize filters from URL query params
    if (Object.keys(query).length > 0) {
      const updatedFilters = { ...filters };
      if (query.category) updatedFilters.category = query.category;
      if (query.phoneModel) updatedFilters.phoneModel = query.phoneModel;
      if (query.minPrice) updatedFilters.minPrice = query.minPrice;
      if (query.maxPrice) updatedFilters.maxPrice = query.maxPrice;
      if (query.sort) updatedFilters.sort = query.sort;
      setFilters(updatedFilters);
    }
    
    // Fetch categories and phone models
    const fetchFiltersData = async () => {
      try {
        const [categoriesRes, phoneModelsRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/products/phone-models')
        ]);
        setCategories(categoriesRes.data);
        setPhoneModels(phoneModelsRes.data);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    
    fetchFiltersData();
    fetchProducts();
  }, [query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // In development mode, always use mock products for now
      // This ensures we can see the products with the images we have
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock products for development');
        setProducts(getMockProducts());
        setLoading(false);
        return;
      }
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.phoneModel) queryParams.append('phoneModel', filters.phoneModel);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.sort) queryParams.append('sort', filters.sort);

      const { data } = await api.get(`/products?${queryParams.toString()}`);
      
      // If no data or no products array, handle gracefully
      if (!data || !data.products) {
        throw new Error('Invalid response format from API');
      }
      
      // Process products to ensure image paths are complete
      const processedProducts = data.products.map(product => ({
        ...product,
        images: product.images?.map(img => {
          // If image is already a full URL, keep it as is
          if (img && img.startsWith('http')) return img;
          // Otherwise, prefix with the products image path
          return `/images/products/${img}`;
        }) || []
      }));
      
      setProducts(processedProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      setLoading(false);
      console.error('Error fetching products:', err);
      
      // For development, create mock products if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock products for development');
        setProducts(getMockProducts());
      }
    }
  };
  
  // Helper function to generate mock products for development
  const getMockProducts = () => {
    const mockProducts = [];
    const categories = ['Silicone', 'Leather', 'Transparent', 'Designer'];
    const phoneModels = ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max'];
    
    // Use the actual images we know exist in the directory
    const availableImages = ['product-1.jpg', 'product-5.jpg'];
    
    // Create 12 mock products
    for (let i = 1; i <= 12; i++) {
      // Use available images in rotation
      const imageIndex = (i - 1) % availableImages.length;
      
      mockProducts.push({
        _id: `${i}`,
        name: `Premium ${categories[i % 4]} Case for ${phoneModels[i % 4]}`,
        price: 1499 + (i * 100),
        discountPrice: i % 3 === 0 ? 1499 + (i * 50) : null,
        category: categories[i % 4],
        phoneModel: phoneModels[i % 4],
        rating: (3 + (i % 3)),
        stock: i % 5 === 0 ? 0 : 10 + i,
        featured: i % 7 === 0,
        // Use the actual image files that exist
        images: [availableImages[imageIndex]],
        colors: ['Black', 'Blue', 'Red']
      });
    }
    
    return mockProducts;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    // Update URL with query params
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.phoneModel) queryParams.append('phoneModel', filters.phoneModel);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.sort) queryParams.append('sort', filters.sort);

    router.push(`/products?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      phoneModel: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    
    router.push('/products');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-dark-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">All iPhone Covers</h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1">Find the perfect cover for your iPhone</p>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={toggleFilters}
            className="mt-4 sm:mt-0 flex items-center text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors sm:hidden"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar - Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:block w-64 bg-dark-200 p-6 rounded-lg border border-dark-100 shadow-lg">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Categories</h3>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md text-white shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">iPhone Model</h3>
              <select
                name="phoneModel"
                value={filters.phoneModel}
                onChange={handleFilterChange}
                className="mt-1 block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
              >
                <option value="">All Models</option>
                {phoneModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Price Range</h3>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <label className="sr-only">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                  />
                </div>
                <div className="w-1/2">
                  <label className="sr-only">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">Sort By</h3>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="mt-1 block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="best-selling">Best Selling</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-accent-600 hover:bg-accent-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="w-full bg-dark-100 hover:bg-dark-50 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden w-full bg-dark-200 p-4 rounded-lg shadow-sm mb-4 border border-dark-100">
              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">Categories</h3>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">iPhone Model</h3>
                <select
                  name="phoneModel"
                  value={filters.phoneModel}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                >
                  <option value="">All Models</option>
                  {phoneModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">Price Range</h3>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-white mb-2">Sort By</h3>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-dark-100 bg-dark-100 rounded-md shadow-sm focus:outline-none focus:ring-accent-500 focus:border-accent-500 text-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={applyFilters}
                  className="w-1/2 bg-accent-600 hover:bg-accent-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="w-1/2 bg-dark-100 hover:bg-dark-50 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : error ? (
              <div className="bg-dark-200 border border-red-600/30 p-4 rounded-md text-red-400 text-center">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-dark-200 p-8 rounded-lg shadow-sm text-center border border-dark-100">
                <h3 className="text-lg font-medium text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your filters or browse our categories
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
