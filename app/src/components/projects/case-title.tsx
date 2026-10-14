'use client';

import { useRef } from 'react';

import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/** Page title whose characters rise out of a mask on load. Reduced motion shows it static. */
export function CaseTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { visibility: 'visible' });
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(el, {
          type: 'chars',
          mask: 'chars',
          autoSplit: true,
          onSplit: self =>
            gsap.from(self.chars, {
              yPercent: 115,
              duration: 1.2,
              stagger: 0.04,
              ease: 'expo.out',
              delay: 0.15,
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <h1 ref={ref} className={cn('reveal', className)}>
      {text}
    </h1>
  );
}
