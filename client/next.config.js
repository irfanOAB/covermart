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
        hostname: 'https://covermart-backend.duckdns.org',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
