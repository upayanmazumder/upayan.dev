'use client';

import { m } from 'framer-motion';

import { createSlideVariants, type SlideDirection } from '@/lib/motion';

import { resolveTransition, resolveTrigger, type MotionWrapperProps } from './shared';

interface SlideProps extends MotionWrapperProps {
  direction?: SlideDirection;
  distance?: number;
}

export function Slide({
  children,
  direction = 'up',
  distance = 24,
  delay,
  duration,
  inView = false,
  once = true,
  ...props
}: SlideProps) {
  return (
    <m.div
      variants={createSlideVariants(direction, distance)}
      transition={resolveTransition(delay, duration)}
      {...resolveTrigger(inView, once)}
      {...props}
    >
      {children}
    </m.div>
  );
}
