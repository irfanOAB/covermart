/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', "covermart-backend.onrender.com"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'covermart-backend.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
