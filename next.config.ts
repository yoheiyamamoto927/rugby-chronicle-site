// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // next.config.ts の images セクションに以下を含める
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'cms.universis.site' },
    { protocol: 'https', hostname: 'universis.site' },
    { protocol: 'https', hostname: '**.universis.site' },
  ],
},

  reactStrictMode: true,
};

export default nextConfig;
