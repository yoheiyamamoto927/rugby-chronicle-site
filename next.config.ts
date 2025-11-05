// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.universis.site',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'universis.site',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
