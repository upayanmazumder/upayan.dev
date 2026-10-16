'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { loadSplitText, type SplitTextPlugin } from '@/lib/gsap-split';
import { cn } from '@/lib/utils';

/** Page title whose characters rise out of a mask on load. Reduced motion shows it static. */
export function CaseTitle({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      gsap.set(el, { visibility: 'visible' });
      let cancelled = false;
      let cleanup: (() => void) | undefined;
      void loadSplitText()
        .then(
          contextSafe((SplitText: SplitTextPlugin) => {
            if (cancelled) return;
            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
              const split = SplitText.create(el, {
                type: 'chars',
                mask: 'chars',
                autoSplit: true,
                onSplit: (self: InstanceType<SplitTextPlugin>) =>
                  gsap.from(self.chars, {
                    yPercent: 100,
                    duration: 0.6,
                    // Long names share a 0.3s sweep so the whole title lands within ~0.9s.
                    stagger: { amount: Math.min(0.3, (self.chars.length - 1) * 0.025) },
                    ease: 'expo.out',
                    delay: 0.1,
                  }),
              });
              return () => split.revert();
            });
            cleanup = () => mm.revert();
          })
        )
        .catch(() => {
          // The plain title remains visible if the text plugin fails.
        });
      return () => {
        cancelled = true;
        cleanup?.();
      };
    },
    { scope: ref }
  );
  return (
    <h1 ref={ref} className={cn('reveal', className)}>
      {text}
    </h1>
  );
}
