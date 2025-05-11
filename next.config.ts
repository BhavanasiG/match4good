import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // For the seed data placeholders
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io', // For ImageKit hosted images
        pathname: '/match4good/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // For Faker user avatars from GitHub
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net', // Added for Faker user avatars from jsDelivr
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
