'use client';

import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'motion/react';

import { EASE } from '@/lib/motion';

interface PaneRevealProps {
  children: ReactNode;
  className?: string;
}

/** Content pane entrance: a short rise with a top-down clip so each navigation reads as a new page. */
export function PaneReveal({ children, className }: PaneRevealProps) {
  const reduced = useReducedMotion();
  return (
    <m.div
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 12, clipPath: 'inset(0 0 100% 0 round 0.75rem)' }
      }
      animate={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0 round 0.75rem)' }
      }
      transition={{ duration: reduced ? 0.2 : 0.6, ease: EASE.out }}
      className={className}
    >
      {children}
    </m.div>
  );
}
