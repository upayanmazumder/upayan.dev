'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

// Once per page load: returning to the home route shows the settled hero.
let played = false;

interface HeroIntroProps {
  className?: string;
  children: ReactNode;
}

/**
 * Load-time intro for the hero. Animates `[data-intro="photo"]`, the masked characters of
 * `[data-intro="name"]`, then every `[data-intro="item"]`. Hidden via `.reveal` until it starts.
 */
export function HeroIntro({ className, children }: HeroIntroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe) return;
      const reveal = () => {
        gsap.set(root, { visibility: 'visible' });
      };
      if (played) {
        reveal();
        return;
      }

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: reduce)', reveal);
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let cancelled = false;
        const run = contextSafe(() => {
          if (cancelled) return;
          played = true;
          const name = root.querySelector<HTMLElement>('[data-intro="name"]');
          const photo = root.querySelector('[data-intro="photo"]');
          const items = root.querySelectorAll('[data-intro="item"]');
          const split = name
            ? SplitText.create(name, { type: 'lines,chars', mask: 'lines' })
            : null;

          const tl = gsap.timeline({ onComplete: () => split?.revert() });
          reveal();
          if (photo) {
            tl.from(
              photo,
              {
                autoAlpha: 0,
                scale: 0.72,
                filter: 'blur(10px)',
                duration: 1.3,
                clearProps: 'filter',
              },
              0
            );
          }
          if (split) tl.from(split.chars, { yPercent: 115, duration: 1.15, stagger: 0.032 }, 0.12);
          tl.from(
            items,
            {
              autoAlpha: 0,
              y: 22,
              filter: 'blur(6px)',
              duration: 0.95,
              stagger: 0.075,
              clearProps: 'filter',
            },
            0.5
          );
        });
        // Split after webfonts settle so the line masks match the final glyph widths.
        void document.fonts.ready.then(run);
        return () => {
          cancelled = true;
        };
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  );
}
