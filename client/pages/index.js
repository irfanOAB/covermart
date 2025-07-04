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
    <div className="min-h-screen">
      {/* Hero Section - Full screen with video background */}
      <section className="h-screen relative bg-black overflow-hidden">
        {/* Video Background - In production, replace with actual video */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
          <div className="w-full h-full overflow-hidden">
            <Image
              src="/images/hero-background.jpg"
              alt="iPhone Covers"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Premium Protection.<br />Stunning Design.
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Elevate your iPhone with our premium covers that combine exceptional protection with beautiful aesthetics.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/products" className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-md font-medium text-lg transition-colors">
                Shop Collection
              </Link>
              <Link href="#device-selector" className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-4 rounded-md font-medium text-lg transition-colors">
                Find Your Device
              </Link>
            </div>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-9 border-2 border-white/50 rounded-full flex justify-center pt-1">
              <motion.div 
                animate={{ 
                  y: [0, 12, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5 
                }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Device Selector Section */}
      <section id="device-selector" className="py-20 bg-dark-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Find Your Perfect Cover</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Select your iPhone model to discover our premium collection of covers designed specifically for your device.</p>
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
                  className={`flex-shrink-0 py-3 px-5 rounded-md transition-all whitespace-nowrap ${activeModel === model 
                    ? 'bg-accent-600 text-white font-medium' 
                    : 'bg-dark-100 text-gray-300 hover:bg-dark-50'}`}
                >
                  {model}
                </button>
              ))}
            </div>
            
            <div className="mt-10 flex flex-col md:flex-row items-center bg-dark-200 rounded-xl overflow-hidden border border-dark-100">
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-4 text-white">{activeModel} Covers</h3>
                <p className="text-gray-400 mb-6">Our premium collection for {activeModel} combines stunning aesthetics with exceptional protection. Each cover is precision engineered for a perfect fit.</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Precision-engineered fit</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>Premium materials</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-accent-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span>MagSafe compatible</span>
                  </li>
                </ul>
                <Link href={`/products?device=${encodeURIComponent(activeModel)}`} className="inline-flex items-center bg-accent-600 text-white px-6 py-3 rounded-md hover:bg-accent-700 transition-colors">
                  Shop {activeModel} Covers
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
      
      {/* Featured Products Section - Modern Design */}
      <section className="py-20 bg-dark-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 text-white">Featured Collection</h2>
            <Link href="/products" className="flex items-center text-white group">
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
            <div className="bg-dark-200 border border-red-600/30 p-6 rounded-xl text-red-400 text-center max-w-2xl mx-auto">{error}</div>
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
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square bg-dark-200 flex items-center justify-center p-6">
                        <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="p-4">
                        <div className="h-4 bg-dark-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-dark-100 rounded w-1/2"></div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section - Modern, Clean Design */}
      <section className="py-20 bg-dark-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Shop by Category</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our exclusive collection of premium iPhone covers categorized for your convenience.</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use modern styled category cards with hover effects */}
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
                  className="group block w-full h-full relative overflow-hidden rounded-xl"
                >
                  <div className="aspect-square w-full bg-dark-200 overflow-hidden">
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 z-10 group-hover:opacity-70 transition-opacity"></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                        <h3 className="text-white font-bold text-xl md:text-2xl mb-1">{category.name}</h3>
                        <p className="text-white/80 text-sm transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">Explore Collection</p>
                      </div>
                      <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="w-full h-full bg-dark-100 flex items-center justify-center">
                          {/* In production, replace with actual images */}
                          <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
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

      {/* Special Offer Banner */}
      <section className="py-12 md:py-16 bg-dark-300">
        <div className="container mx-auto px-4">
          <div className="bg-accent-600 rounded-xl text-white overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Special Offer</h3>
                <p className="mb-6">Get 15% off on your first order with code <span className="font-bold">WELCOME15</span></p>
                <Link href="/products" className="bg-dark-100 text-white hover:bg-dark-50 px-6 py-3 rounded-full font-medium inline-block">
                  Shop Now
                </Link>
              </div>
              <div className="md:w-1/2 py-6 px-8 md:p-0">
                <div className="relative h-48 md:h-64 w-full">
                  <div className="absolute right-0 top-0 h-full w-full md:w-11/12 rounded-l-full bg-accent-500 flex items-center justify-center">
                    <span className="text-3xl md:text-5xl font-bold">15% OFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Call-to-Action Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Add a subtle pattern or texture here in production */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-800 mix-blend-multiply"></div>
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
            <p className="text-lg md:text-xl mb-10 text-gray-300">Discover our premium collection of exquisitely crafted covers that blend style, protection, and innovation for your iPhone.</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Shop Collection
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link 
                href="/about" 
                className="inline-flex items-center justify-center border border-white text-white px-8 py-4 rounded-md font-medium hover:bg-white hover:text-black transition-all"
              >
                Our Story
              </Link>
            </div>
            
            <div className="mt-12">
              <p className="text-sm text-gray-400">Free shipping • 30-day returns • 1-year warranty</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
