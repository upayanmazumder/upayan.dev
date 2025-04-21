import dotenv from 'dotenv';
import path from 'path';
import type { NextConfig } from 'next';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
};

export default nextConfig;
