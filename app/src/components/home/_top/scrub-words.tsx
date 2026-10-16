'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, SplitText, useGSAP } from '@/lib/gsap';

interface ScrubWordsProps {
  className?: string;
  children: ReactNode;
}

/**
 * Lines brighten from 35% to full opacity as the block scrolls through the viewport. Splitting by
 * line keeps the DOM small and re-splits on resize. Static under reduced motion.
 */
export function ScrubWords({ className, children }: ScrubWordsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(root.querySelectorAll('p'), {
          type: 'lines',
          autoSplit: true,
          // Returning the tween lets SplitText kill and rebuild it whenever the lines re-flow.
          onSplit: self =>
            gsap.fromTo(
              self.lines,
              { opacity: 0.35 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.1,
                scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
              }
            ),
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
