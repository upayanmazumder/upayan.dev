'use client';

import { lazy, type ReactNode } from 'react';

import { NearWidget } from './near-widget';

const Tilt = lazy(() =>
  import('@/components/certificates/tilt').then(module => ({ default: module.Tilt }))
);

export function CertificateCard({ children }: { children: ReactNode }) {
  return (
    <NearWidget
      className="h-full"
      fallback={
        <div className="[perspective:900px]">
          <div className="h-full">{children}</div>
        </div>
      }
    >
      <Tilt>{children}</Tilt>
    </NearWidget>
  );
}
