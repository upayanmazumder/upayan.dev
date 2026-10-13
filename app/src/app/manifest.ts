import type { MetadataRoute } from 'next';

import { profile } from '@/data/profile';

const iconSizes = [48, 72, 96, 144, 192, 256, 384, 512];

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: profile.firstName,
    description: profile.sentence,
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d0e',
    theme_color: '#0b0d0e',
    icons: [
      ...iconSizes.map(size => ({
        src: `/icons/icon-${size}x${size}.webp`,
        sizes: `${size}x${size}`,
        type: 'image/webp',
      })),
      {
        src: '/icons/icon-512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  };
}
