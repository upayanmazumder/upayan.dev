'use client';

import type { PointerEvent, ReactNode } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';

import { cn } from '@/lib/utils';

// Critically damped and small: the button leans a few pixels toward the cursor without wobbling.
const SPRING = { stiffness: 320, damping: 34, mass: 0.5 };
// Fraction of the cursor offset the button follows, capped at MAX_PX.
const PULL = 0.08;
const MAX_PX = 4;
const lean = (offset: number) => Math.max(-MAX_PX, Math.min(MAX_PX, offset * PULL));

interface MagneticLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

/** External link that leans toward a fine pointer and springs back on leave. Touch input never moves it. */
export function MagneticLink({
  href,
  className,
  children,
  'aria-label': ariaLabel,
}: MagneticLinkProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(lean(event.clientX - rect.left - rect.width / 2));
    y.set(lean(event.clientY - rect.top - rect.height / 2));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ x: springX, y: springY }}
      className={cn('inline-flex will-change-transform', className)}
    >
      {children}
    </m.a>
  );
}
