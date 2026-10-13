'use client';

import { m } from 'framer-motion';

import { fadeVariants } from '@/lib/motion';

import { resolveTransition, resolveTrigger, type MotionWrapperProps } from './shared';

export function Fade({
  children,
  delay,
  duration,
  inView = false,
  once = true,
  ...props
}: MotionWrapperProps) {
  return (
    <m.div
      variants={fadeVariants}
      transition={resolveTransition(delay, duration)}
      {...resolveTrigger(inView, once)}
      {...props}
    >
      {children}
    </m.div>
  );
}
