'use client';

import { lazy, type ReactNode } from 'react';

import type { PixelCardProps } from '@/components/rb/PixelCard';

import { NearWidget } from './near-widget';

const PixelCard = lazy(() => import('@/components/rb/PixelCard'));

interface SponsorCardProps extends PixelCardProps {
  children: ReactNode;
}

const cardStyle =
  'group relative isolate w-full overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_24px_48px_-24px_rgba(0,0,0,0.85),0_8px_18px_-10px_rgba(0,0,0,0.6)]';

export function SponsorCard({ children, ...settings }: SponsorCardProps) {
  return (
    <NearWidget
      fallback={
        <div className={cardStyle}>
          {children}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
          />
        </div>
      }
    >
      <PixelCard {...settings}>{children}</PixelCard>
    </NearWidget>
  );
}
