'use client';

import { m } from 'framer-motion';

import { scaleVariants } from '@/lib/motion';

import { resolveTransition, resolveTrigger, type MotionWrapperProps } from './shared';

export function Scale({
  children,
  delay,
  duration,
  inView = false,
  once = true,
  ...props
}: MotionWrapperProps) {
  return (
    <m.div
      variants={scaleVariants}
      transition={resolveTransition(delay, duration)}
      {...resolveTrigger(inView, once)}
      {...props}
    >
      {children}
    </m.div>
  );
}
