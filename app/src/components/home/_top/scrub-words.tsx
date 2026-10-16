'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { loadSplitText, type SplitTextPlugin } from '@/lib/gsap-split';

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
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe) return;
      let cancelled = false;
      let cleanup: (() => void) | undefined;
      // SplitText is not part of the first-load bundle; create its animation near the viewport.
      const activate = () => {
        void loadSplitText()
          .then(
            contextSafe((SplitText: SplitTextPlugin) => {
              if (cancelled) return;
              const mm = gsap.matchMedia();
              mm.add('(prefers-reduced-motion: no-preference)', () => {
                const split = SplitText.create(root.querySelectorAll('p'), {
                  type: 'lines',
                  autoSplit: true,
                  onSplit: (self: InstanceType<SplitTextPlugin>) =>
                    gsap.fromTo(
                      self.lines,
                      { opacity: 0.35 },
                      {
                        opacity: 1,
                        ease: 'none',
                        stagger: 0.1,
                        scrollTrigger: {
                          trigger: root,
                          start: 'top 80%',
                          end: 'bottom 55%',
                          scrub: 0.6,
                        },
                      }
                    ),
                });
                return () => split.revert();
              });
              cleanup = () => mm.revert();
            })
          )
          .catch(() => {
            // Keep the original paragraphs if the text effect cannot load.
          });
      };
      // Wait for the section to approach before loading the text plugin.
      const observer = new IntersectionObserver(
        entries => {
          if (!entries[0]?.isIntersecting) return;
          observer.disconnect();
          void activate();
        },
        { rootMargin: '300px' }
      );
      observer.observe(root);
      return () => {
        cancelled = true;
        observer.disconnect();
        cleanup?.();
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
