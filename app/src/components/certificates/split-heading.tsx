'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { loadSplitText, type SplitTextPlugin } from '@/lib/gsap-split';

/** h1 whose characters rise from below a mask on mount. Reduced motion shows it static. */
export function SplitHeading({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (!contextSafe) return;
      let cancelled = false;
      let cleanup: (() => void) | undefined;
      void loadSplitText()
        .then(
          contextSafe((SplitText: SplitTextPlugin) => {
            if (cancelled || !ref.current) return;
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
              const split = SplitText.create(ref.current!, { type: 'chars', mask: 'chars' });
              gsap.from(split.chars, {
                yPercent: 100,
                duration: 0.6,
                stagger: 0.02,
                ease: 'expo.out',
              });
              return () => split.revert();
            });
            cleanup = () => mm.revert();
          })
        )
        .catch(() => {
          // The unsplit heading remains visible if the text plugin fails.
        });
      return () => {
        cancelled = true;
        cleanup?.();
      };
    },
    { scope: ref }
  );

  return (
    <h1 ref={ref} className={className}>
      {text}
    </h1>
  );
}
