'use client';

import type { ReactNode } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
