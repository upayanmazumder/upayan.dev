import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './globals.css';

import { SiteFooter } from '@/components/footer/site-footer';
import { MotionProvider } from '@/components/motion';
import { SiteNav } from '@/components/nav/site-nav';
import { QueryProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { profile } from '@/data/profile';
import { env } from '@/env';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: `${profile.name} · ${profile.role}`, template: `%s · ${profile.name}` },
  description: `${profile.sentence} ${profile.about[2]}`,
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  openGraph: { type: 'website', siteName: profile.name, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0b0d0e',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('dark antialiased', fontVariables)}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-foreground px-3 py-2 text-sm text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <QueryProvider>
          <NuqsAdapter>
            <MotionProvider>
              <SiteNav />
              <main id="main">{children}</main>
              <SiteFooter />
            </MotionProvider>
          </NuqsAdapter>
        </QueryProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
