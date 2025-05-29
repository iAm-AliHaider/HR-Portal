/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress GoTrueClient warnings in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: 'error'
      };
    }
    return config;
  },
  reactStrictMode: false,
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
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  // Ensure proper static generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;