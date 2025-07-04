import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../../utils/AuthContext';
import { useCart } from '../../utils/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('en');
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();
  
  const cartCount = cartItems?.length || 0;
  const isAdmin = user?.role === 'admin';

  const toggleMobileSearch = () => setIsMobileSearch(!isMobileSearch);
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsMobileSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMenuOpen]);

  return (
    <header className="bg-dark-300/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-display font-bold">
                <span className="text-white">Cover</span>
                <span className="gradient-text">Mart</span>
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white/80 hover:text-accent-400 transition-colors duration-300">
              Home
            </Link>
            <Link href="/products" className="text-white/80 hover:text-accent-400 transition-colors duration-300">
              All Covers
            </Link>
            <Link href="/products?category=new" className="text-white/80 hover:text-accent-400 transition-colors duration-300">
              New Arrivals
            </Link>
            <Link href="/products?category=trending" className="text-white/80 hover:text-accent-400 transition-colors duration-300">
              Trending
            </Link>
          </nav>

          {/* Search, Cart, User - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={language === 'en' ? "Search covers..." : "कवर खोजें..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 bg-dark-100 border border-dark-200 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </form>

            {/* Language Toggle */}
            <motion.button 
              onClick={toggleLanguage} 
              className="px-3 py-1 rounded-full border border-white/10 text-white/80 hover:border-accent-500 hover:text-accent-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </motion.button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-full border border-white/10 hover:border-accent-500 hover:bg-dark-100 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <motion.button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="p-2 rounded-full border border-white/10 hover:border-accent-500 hover:bg-dark-100 transition-colors focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user ? (
                  <span className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center font-medium">
                    {user.name?.charAt(0) || 'U'}
                  </span>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )}
              </motion.button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-48 bg-dark-200 border border-white/10 rounded-md shadow-xl py-1 z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <Link href="/account" className="block px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                          My Account
                        </Link>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="block px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                            Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={handleLogout} 
                          className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                          Login
                        </Link>
                        <Link href="/register" className="block px-4 py-2 text-sm text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Mobile Cart Link */}
            <Link href="/cart" className="relative p-2 rounded-full border border-white/10 hover:border-accent-500 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Search Button */}
            <button 
              onClick={toggleMobileSearch}
              className="p-2 rounded-full border border-white/10 hover:border-accent-500 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            {/* Mobile Menu Button */}
            <div className="mobile-menu-container">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md border border-white/10 hover:border-accent-500 focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearch && (
            <motion.div 
              className="md:hidden py-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search covers..." : "कवर खोजें..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-dark-100 border border-dark-200 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden bg-dark-300 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-3 space-y-2">
                <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                  All Covers
                </Link>
                <Link href="/products?category=new" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                  New Arrivals
                </Link>
                <Link href="/products?category=trending" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                  Trending
                </Link>
                
                <div className="pt-4 pb-1 border-t border-white/10">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center px-3">
                        <div className="w-8 h-8 rounded-full bg-accent-600 text-white flex items-center justify-center font-medium mr-3">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="text-white">{user?.name || 'User'}</div>
                      </div>
                      <Link href="/account" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                        My Account
                      </Link>
                      <Link href="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                        Login
                      </Link>
                      <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-dark-100 hover:text-accent-400 transition-colors">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
