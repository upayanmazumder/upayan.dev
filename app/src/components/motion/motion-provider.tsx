'use client';

import type { ReactNode } from 'react';
import { domMax, LazyMotion, MotionConfig } from 'motion/react';

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
