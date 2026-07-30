/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Enable static HTML export for Surge deployment
  output: 'export',
}

module.exports = nextConfig
