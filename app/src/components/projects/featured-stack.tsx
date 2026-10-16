'use client';

import { useRef, type CSSProperties } from 'react';

import { Reveal } from '@/components/shell/reveal';
import type { FeaturedProject } from '@/data/types';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

import { FeaturedCard } from './featured-card';
import { scheduleRefresh } from './schedule-refresh';

/** Distance from the viewport top where the first card pins, and the extra offset each later card adds. */
const PIN_TOP = 96;
const PEEK = 18;

/**
 * Desktop: each card pins under the previous one's peek; the next card slides over it while the
 * covered card scales to 0.96 and dims slightly. Pins use pinSpacing:false so flow height never changes,
 * which keeps the start and end free of jumps. Mobile and reduced motion get plain stacked cards.
 */
export function FeaturedStack({ projects }: { projects: FeaturedProject[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const items = gsap.utils.toArray<HTMLElement>('[data-stack-item]', root.current);
        const last = items.at(-1);
        if (!last || items.length < 2) return;
        const lastTop = PIN_TOP + (items.length - 1) * PEEK;

        items.slice(0, -1).forEach((item, i) => {
          const next = items[i + 1]!;
          ScrollTrigger.create({
            trigger: item,
            start: `top top+=${PIN_TOP + i * PEEK}`,
            endTrigger: last,
            end: `top top+=${lastTop}`,
            pin: true,
            pinSpacing: false,
          });
          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: `top top+=${PIN_TOP + (i + 1) * PEEK}`,
                scrub: true,
              },
            })
            .to(item.querySelector('[data-stack-card]'), { scale: 0.96 }, 0)
            .to(item.querySelector('[data-stack-dim]'), { opacity: 0.2 }, 0);
        });

        // Live data above changes page height; re-measure once it settles. Width changes are ScrollTrigger's own resize refresh.
        // The first callback fires on observe and only records the starting size.
        let height = -1;
        let width = window.innerWidth;
        const observer = new ResizeObserver(([entry]) => {
          const next = Math.round(entry?.borderBoxSize[0]?.blockSize ?? 0);
          const first = height < 0;
          if (next === height) return;
          height = next;
          if (first) return;
          if (window.innerWidth !== width) {
            width = window.innerWidth;
            return;
          }
          scheduleRefresh();
        });
        observer.observe(document.body);
        return () => observer.disconnect();
      });
    },
    { scope: root }
  );

  return (
    <Reveal stagger={0.05}>
      <div ref={root} className="flex flex-col gap-6 md:gap-10">
        {projects.map((project, i) => (
          <div
            key={project.slug}
            data-stack-item
            className="md:h-[min(40rem,calc(100svh-var(--stack-reserve)))]"
            style={
              {
                '--stack-reserve': `${PIN_TOP + (projects.length - 1) * PEEK + 32}px`,
              } as CSSProperties
            }
          >
            <div data-reveal className="h-full">
              <FeaturedCard project={project} index={i} className="h-full" />
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
