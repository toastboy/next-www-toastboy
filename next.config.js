/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Disable minification for this component as a workaround: see
  // https://github.com/vercel/next.js/issues/59432
  experimental: {
    serverComponentsExternalPackages: ['@azure/storage-blob'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/**',
      },
    ],
  },
};
