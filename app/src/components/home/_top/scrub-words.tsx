'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, SplitText, useGSAP } from '@/lib/gsap';

interface ScrubWordsProps {
  className?: string;
  children: ReactNode;
}

/** Words brighten from 20% to full opacity as the block scrolls through the viewport. Static under reduced motion. */
export function ScrubWords({ className, children }: ScrubWordsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(root.querySelectorAll('p'), { type: 'words' });
        gsap.fromTo(
          split.words,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 55%', scrub: 0.6 },
          }
        );
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
