import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-6 pt-10 pb-6 relative z-10">
        <div className="flex flex-wrap">
          {/* Company Info */}
          <motion.div
            className="w-full md:w-1/4 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-4 font-montserrat text-gray-800">
              CoverMart
            </h2>
            <p className="text-gray-600 text-sm">
              India's premium destination for stylish and protective iPhone covers.
              Find the perfect case that matches your style and keeps your device safe.
            </p>
            <div className="mt-4 flex space-x-4">
              {[
                { href: 'https://facebook.com', label: 'Facebook' },
                { href: 'https://instagram.com', label: 'Instagram' },
                { href: 'https://twitter.com', label: 'Twitter' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-800 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social.label}</span>
                  {/* social icons */}
                  {social.label === 'Facebook' && (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {social.label === 'Instagram' && (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {social.label === 'Twitter' && (
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="w-full md:w-1/4 mb-6 md:mb-0 md:pl-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 font-montserrat text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Covers' },
                { href: '/products?category=new', label: 'New Arrivals' },
                { href: '/products?category=trending', label: 'Trending' },
                { href: '/cart', label: 'Your Cart' },
              ].map((link, idx) => (
                <motion.li
                  key={idx}
                  className="group"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center"
                  >
                    <svg
                      className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            className="w-full md:w-1/4 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 font-montserrat text-gray-800">
              Customer Service
            </h3>
            <ul className="space-y-2">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/faqs', label: 'FAQs' },
                { href: '/shipping', label: 'Shipping Policy' },
                { href: '/returns', label: 'Returns & Refunds' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map((link, idx) => (
                <motion.li
                  key={idx}
                  className="group"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center"
                  >
                    <svg
                      className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="w-full md:w-1/4 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 font-montserrat text-gray-800">
              Connect With Us
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest products, offers, and updates.
            </p>
            <form className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 mb-2 sm:mb-0 sm:mr-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
              />
              <motion.button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="mb-4 flex flex-wrap justify-center gap-4">
            {['razorpay', 'upi', 'paytm', 'visa', 'mastercard'].map((name) => (
              <motion.img
                key={name}
                src={`/images/payment/${name}.svg`}
                alt={name}
                className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
          <p className="text-gray-500">
            © {new Date().getFullYear()} CoverMart. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
