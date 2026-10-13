import type { Easing, Transition, Variants } from 'framer-motion';

type Bezier = [number, number, number, number];

export const EASE = {
  out: [0.16, 1, 0.3, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
} satisfies Record<string, Easing>;

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
} as const;

export const defaultTransition: Transition = {
  duration: DURATION.base,
  ease: EASE.out,
};

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 24 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18 },
} satisfies Record<string, Transition>;

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export function createSlideVariants(direction: SlideDirection, distance = 24): Variants {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const sign = direction === 'up' || direction === 'left' ? 1 : -1;
  return {
    hidden: { opacity: 0, [axis]: sign * distance },
    visible: { opacity: 1, [axis]: 0 },
  };
}

export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0 },
};
