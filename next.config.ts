import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: ['ik.imagekit.io'],
  },
};

export default nextConfig;
