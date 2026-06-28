import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ]
  },
  async rewrites() {
    return [
      { source: '/new-in', destination: '/category/new-in' },
      { source: '/western-wear', destination: '/category/western-wear' },
      { source: '/ethnic-wear', destination: '/category/ethnic-wear' },
      { source: '/indo-western', destination: '/category/indo-western' },
      { source: '/accessories', destination: '/category/accessories' }
    ];
  },
  typedRoutes: false
};

export default nextConfig;
