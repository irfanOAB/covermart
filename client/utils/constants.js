/**
 * Application-wide constants
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Silicone',
  'Leather',
  'Transparent',
  'Hard Case',
  'Wallet Case',
  'Magnetic'
];

// Phone Models
export const PHONE_MODELS = [
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

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Image paths
export const IMAGE_BASE_PATH = '/images';

// Currency
export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';
