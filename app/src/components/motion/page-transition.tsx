'use client';

import type { ReactNode } from 'react';
import { m } from 'framer-motion';

import { defaultTransition, pageVariants } from '@/lib/motion';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <m.div
      className={className}
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      transition={defaultTransition}
    >
      {children}
    </m.div>
  );
}
