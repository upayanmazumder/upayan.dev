'use client';

import { useRef } from 'react';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const LETTERS = 'UPAYAN'.split('');

/**
 * Giant footer wordmark. Letters rise from below a clip line, then a solid layer wipes up over the outline.
 * Scrubbed against scroll. Reduced motion and no-JS show the solid wordmark.
 */
export function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            // Bounded to the stretch where the wordmark enters view. Clamped to the page end because the
            // wordmark sits at the bottom, and a short viewport could otherwise leave the letters half filled.
            end: self =>
              Math.min(self.start + window.innerHeight * 0.6, ScrollTrigger.maxScroll(window)),
            scrub: 0.5,
          },
        });
        tl.from('[data-letter]', { yPercent: 105, stagger: 0.05, duration: 0.6 })
          .from(
            '[data-solid]',
            { clipPath: 'inset(0% 0% 100% 0%)', stagger: 0.05, duration: 0.5 },
            0.3
          )
          .from('[data-reflection]', { autoAlpha: 0, duration: 0.4 }, 0.5);
      });
    },
    { scope: ref }
  );

  const row = (reflection = false) => (
    <div className="flex justify-between" aria-hidden>
      {LETTERS.map((l, i) => (
        <span key={i} className="block overflow-hidden" style={{ paddingInline: '0.01em' }}>
          <span data-letter={reflection ? undefined : ''} className="relative block">
            <span className="block text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)]">
              {l}
            </span>
            <span
              data-solid={reflection ? undefined : ''}
              className="absolute inset-0 block bg-gradient-to-b from-foreground to-teal/70 bg-clip-text text-transparent"
              style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            >
              {l}
            </span>
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="@container select-none">
      <p className="sr-only">Upayan</p>
      <div className="font-display text-[21cqw] leading-[0.82] font-bold tracking-tight">
        {row()}
        <div
          data-reflection
          className="pointer-events-none -scale-y-100 [mask-image:linear-gradient(to_top,black,transparent_55%)] opacity-25"
        >
          {row(true)}
        </div>
      </div>
    </div>
  );
}
