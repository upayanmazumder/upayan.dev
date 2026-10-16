'use client';

import { useRef, type ElementType, type ReactNode } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Seconds between each `[data-reveal]` child. */
  stagger?: number;
  /** ScrollTrigger start, e.g. "top 85%". */
  start?: string;
}

/**
 * Reveals `[data-reveal]` descendants (or the wrapper itself if none) on scroll.
 * Elements fade up a short distance once. Reduced motion skips the tween and shows content.
 */
export function Reveal({
  as: Tag = 'div',
  className,
  children,
  stagger = 0.05,
  start = 'top 85%',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const marked = root.querySelectorAll<HTMLElement>('[data-reveal]');
      const targets = marked.length > 0 ? Array.from(marked) : [root];
      gsap.set(root, { visibility: 'visible' });

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(targets, {
          autoAlpha: 0,
          y: 12,
          duration: 0.6,
          stagger,
          scrollTrigger: { trigger: root, start, once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={cn('reveal', className)}>
      {children}
    </Tag>
  );
}
