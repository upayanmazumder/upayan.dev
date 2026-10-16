'use client';

import { useRef } from 'react';

import { gsap, SplitText, useGSAP } from '@/lib/gsap';

/** h1 whose characters rise from below a mask on mount. Reduced motion shows it static. */
export function SplitHeading({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(ref.current!, { type: 'chars', mask: 'chars' });
        gsap.from(split.chars, { yPercent: 100, duration: 0.6, stagger: 0.02, ease: 'expo.out' });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <h1 ref={ref} className={className}>
      {text}
    </h1>
  );
}
