import type { MetadataRoute } from 'next';

import { featuredProjects } from '@/data/projects';
import { env } from '@/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...featuredProjects.map(project => ({
      url: `${base}/projects/${project.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${base}/certificates`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/devjourney`, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
