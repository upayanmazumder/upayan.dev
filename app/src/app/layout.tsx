import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './globals.css';

import { SiteFooter } from '@/components/footer/site-footer';
import { MotionProvider } from '@/components/motion';
import { SiteNav } from '@/components/nav/site-nav';
import { QueryProvider } from '@/components/providers';
import { Backdrop } from '@/components/shell/backdrop';
import { SmoothScroll } from '@/components/shell/smooth-scroll';
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
      <head>
        {/* Marks JS as available before paint so `.reveal` content can wait for its animation. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <QueryProvider>
          <NuqsAdapter>
            <MotionProvider>
              <SmoothScroll>
                <Backdrop />
                <SiteNav />
                <main id="main">{children}</main>
                <SiteFooter />
              </SmoothScroll>
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
