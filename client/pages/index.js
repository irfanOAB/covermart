import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layout/Layout';
import Spinner from '../components/ui/Spinner';
import ProductCard from '../components/products/ProductCard';
import axios from 'axios';
import api from '../utils/api';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState('iPhone 15 Pro Max');

  // iPhone models for the device selector
  const iphoneModels = [
    'iPhone 15 Pro Max',
    'iPhone 15 Pro',
    'iPhone 15 Plus',
    'iPhone 15',
    'iPhone 14 Pro Max',
    'iPhone 14 Pro',
    'iPhone 14',
    'iPhone 13 Pro Max',
    'iPhone 13 Pro',
    'iPhone 13',
    'iPhone SE'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch both featured and new products
        const [featuredResponse, newArrivalsResponse] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new')
        ]);

        setFeaturedProducts(featuredResponse.data);
        setNewArrivals(newArrivalsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-landing.jpg"
            alt="Designer Mobile Covers"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Designer Mobile Covers
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Custom name designs, camera protection, and tempered glass protection for your device.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/products" className="bg-white hover:bg-gray-100 text-black px-8 py-4 font-medium text-lg transition-colors">
                  Shop Now
                </Link>
                <Link href="/products/custom" className="border border-white hover:bg-white/10 text-white px-8 py-4 font-medium text-lg transition-colors">
                  Customize
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Device Selector Section */}
      <section id="device-selector" className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Find Your Perfect Case</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Select your iPhone model to discover our premium collection of cases designed specifically for your device.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto">
            <div className="flex overflow-x-auto pb-4 hide-scrollbar space-x-4 justify-center">
              {iphoneModels.map((model, index) => (
                <button
                  key={model}
                  onClick={() => setActiveModel(model)}
                  className={`flex-shrink-0 py-3 px-5 transition-all whitespace-nowrap ${activeModel === model
                    ? 'bg-black text-white font-medium'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {model}
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-col md:flex-row items-center bg-white overflow-hidden border border-gray-200">
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-4 text-black">{activeModel} Cases</h3>
                <p className="text-gray-600 mb-6">Our premium collection for {activeModel} combines minimalist aesthetics with exceptional protection. Each case is precision engineered for a perfect fit.</p>
                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Precision-engineered fit</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Premium materials</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>MagSafe compatible</span>
                  </li>
                </ul>
                <Link href={`/products?device=${encodeURIComponent(activeModel)}`} className="inline-flex items-center bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors">
                  Shop {activeModel} Cases
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src={`/images/devices/${activeModel.toLowerCase().replace(' ', '-')}.png`}
                    alt={activeModel}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Second Hero Section - Product Features */}
      <section className="py-20 bg-black text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Feature image */}
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative w-full h-[400px] md:h-[500px]">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Camera Protection</h3>
                    <p className="text-gray-300">Enhanced camera bump protection for your device</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Custom Design</h3>
                    <p className="text-gray-300">Personalized name and pattern options</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Tempered Glass</h3>
                    <p className="text-gray-300">Premium protection against scratches</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Perfect Fit</h3>
                    <p className="text-gray-300">Precisely designed for your device model</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Text content */}
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Premium Features</h2>
                <p className="text-gray-300 mb-8 text-lg">
                  Our designer mobile covers combine style with superior protection. Each case features premium materials and thoughtful design elements to keep your device safe and looking great.
                </p>
                <ul className="space-y-4 mb-8 text-gray-200">
                  <li className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Custom name designs for personalization</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Enhanced camera protection technology</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Premium tempered glass protection</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Available for all popular phone models</span>
                  </li>
                </ul>
                <Link href="/products" className="inline-block bg-white text-black px-8 py-4 font-medium text-lg hover:bg-gray-100 transition-colors">
                  Shop Designer Cases
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Clean, Minimal Design */}
      <section id="featured" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 text-black">Featured Collection</h2>
            <Link href="/products" className="flex items-center text-black group">
              <span className="mr-2 group-hover:underline">View All Products</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner size="large" />
            </div>
          ) : error ? (
            <div className="bg-gray-100 border border-red-300 p-6 text-red-700 text-center max-w-2xl mx-auto">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}

              {/* Placeholder for testing if no products are returned from API */}
              {featuredProducts.length === 0 && (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white overflow-hidden border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="aspect-square bg-gray-100 flex items-center justify-center p-6">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Shop by Category Section - Clean, Minimal Design */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore our exclusive collection of premium iPhone cases categorized for your convenience.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Clean, minimal styled category cards */}
            {[
              { name: 'Silicone', image: '/images/categories/silicone.jpg', slug: 'silicone' },
              { name: 'Leather', image: '/images/categories/leather.jpg', slug: 'leather' },
              { name: 'Transparent', image: '/images/categories/transparent.jpg', slug: 'transparent' },
              { name: 'Designer', image: '/images/categories/designer.jpg', slug: 'designer' }
            ].map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group block w-full h-full relative overflow-hidden border border-gray-200 bg-white"
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 z-10"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        <h3 className="text-black font-bold text-xl md:text-2xl mb-1">{category.name}</h3>
                        <p className="text-gray-600 text-sm transform translate-y-0 group-hover:translate-y-0 transition-all duration-300">Explore Collection</p>
                      </div>
                      <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          {/* In production, replace with actual images */}
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Hero Section with hero-landing2.jpg */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 z-0">
          <Image src="/images/hero/hero-landing2.jpg" alt="Premium Phone Cases" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 text-white mb-10 md:mb-0"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Premium Protection</h2>
              <p className="text-lg md:text-xl mb-8">Our cases are engineered to provide maximum protection while maintaining the sleek profile of your device.</p>
              <Link href="/products" className="bg-white hover:bg-gray-100 text-black px-8 py-4 font-medium text-lg transition-colors inline-block">
                Explore Collection
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:w-1/3"
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 border border-white/20 text-white">
                <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Military-grade drop protection
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Precision engineered fit
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Premium materials
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Lifetime warranty
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-black text-white overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Special Offer</h3>
                <p className="mb-6">Get 15% off on your first order with code <span className="font-bold">WELCOME15</span></p>
                <Link href="/products" className="bg-white text-black hover:bg-gray-100 px-6 py-3 font-medium inline-block">
                  Shop Now
                </Link>
              </div>
              <div className="md:w-1/2 py-6 px-8 md:p-0">
                <div className="relative h-48 md:h-64 w-full">
                  <div className="absolute right-0 top-0 h-full w-full md:w-11/12 flex items-center justify-center">
                    <span className="text-3xl md:text-5xl font-bold">15% OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Call-to-Action Section */}
      <section className="py-24 bg-gray-50 text-black relative overflow-hidden border-t border-gray-200">
        <div className="absolute inset-0 opacity-5">
          {/* Add a subtle pattern or texture here in production */}
          <div className="absolute inset-0 bg-black mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Elevate Your iPhone Experience</h2>
            <p className="text-lg md:text-xl mb-10 text-gray-600">Discover our premium collection of exquisitely crafted cases that blend style, protection, and innovation for your iPhone.</p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center bg-black text-white px-8 py-4 font-medium hover:bg-gray-900 transition-colors"
              >
                Shop Collection
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-all"
              >
                Our Story
              </Link>
            </div>

            <div className="mt-12">
              <p className="text-sm text-gray-500">Free shipping • 30-day returns • 1-year warranty</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
