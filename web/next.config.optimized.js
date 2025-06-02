/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress GoTrueClient warnings in development
  webpack: (config, { dev }) => {
    if (dev) {
      config.infrastructureLogging = {
        level: "error",
      };

      // Suppress specific warnings
      config.ignoreWarnings = [
        /Critical dependency: the request of a dependency is an expression/,
        /Module not found: Can't resolve/,
      ];
    }
    return config;
  },

  reactStrictMode: false,
  trailingSlash: false,

  // Optimized image configuration
  images: {
    unoptimized: true,
    domains: ["localhost"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  poweredByHeader: false,
  compress: true,

  // Ensure proper static generation
  generateBuildId: async () => {
    return "build-" + Date.now();
  },

  // Custom headers for better error handling
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Handle redirects for missing assets
  async redirects() {
    return [
      {
        source: "/apple-touch-icon.png",
        destination: "/icons/icon-192x192.png",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/icons/icon-192x192.png",
        permanent: false,
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
  },

  // API configuration
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
    responseLimit: "8mb",
  },

  // Custom error handling
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: "/api/fallback?path=:path*",
        },
      ],
    };
  },
};

module.exports = nextConfig;
