import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

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

const withMDX = createMDX({});

export default withMDX(nextConfig);
