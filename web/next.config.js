/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force all pages to be dynamic
  experimental: {
    isrFlushToDisk: false,
  },
  // Disable static optimization completely
  poweredByHeader: false,
  compress: true,
  // Prevent static export
  async exportPathMap() {
    return {};
  }
};

module.exports = nextConfig;