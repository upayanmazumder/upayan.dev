import './src/env';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: { formats: ['image/avif', 'image/webp'] },
  // Routes from the previous site that no longer exist.
  async redirects() {
    return [
      { source: '/p', destination: '/#projects', permanent: true },
      { source: '/p/:path*', destination: '/#projects', permanent: true },
      { source: '/contact', destination: '/#elsewhere', permanent: true },
    ];
  },
};

export default nextConfig;
