'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { afterReveal } from '@/lib/page-load';
import { cn } from '@/lib/utils';

/** How long after the preloader reveals the page the hands wave once on their own, and for how long. */
const WAVE_AT_MS = 3000;
const WAVE_FOR_MS = 2400;

function Hand({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 34"
      className={cn(
        'pointer-events-none absolute -top-1 -z-10 w-5 translate-y-4 opacity-0 transition-[translate,opacity] duration-500 ease-out-expo group-hover/cta:-translate-y-5 group-hover/cta:opacity-100 group-focus-visible/cta:-translate-y-5 group-focus-visible/cta:opacity-100 group-data-[wave=true]/cta:-translate-y-5 group-data-[wave=true]/cta:opacity-100 motion-reduce:hidden',
        side === 'left' ? 'left-2 -scale-x-100' : 'right-2 delay-75'
      )}
    >
      <g className="origin-bottom [transform-box:fill-box] group-hover/cta:animate-[hand-wave_0.9s_ease-in-out_infinite] group-data-[wave=true]/cta:animate-[hand-wave_0.9s_ease-in-out_infinite]">
        <path
          d="M8 34 L8 18 Q3 15 3 9 Q3 7 5 7 Q6 7 6.5 9 L7.5 13 L8 4 Q8 2 10 2 Q12 2 12 4 L12.5 12 L14 5 Q14.5 3 16.3 3.4 Q18 4 17.6 6 L16 14 L19 10 Q20.3 8.8 21.5 10 Q22.4 11.2 21.4 12.6 L16 20 L16 34 Z"
          fill="var(--teal)"
          stroke="var(--background)"
          strokeWidth={1.2}
        />
        <circle cx={12} cy={22} r={1.4} fill="var(--background)" opacity={0.5} />
      </g>
    </svg>
  );
}

/**
 * Two three-fingered hands that pop up from behind a call to action and wave while it is hovered.
 * Three seconds after the preloader reveals the page they also wave once on their own, to point at it.
 */
export function AlienHands({ children }: { children: ReactNode }) {
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    let stop = 0;
    const cancel = afterReveal(WAVE_AT_MS, () => {
      setWaving(true);
      stop = window.setTimeout(() => setWaving(false), WAVE_FOR_MS);
    });
    return () => {
      cancel();
      window.clearTimeout(stop);
    };
  }, []);

  return (
    <span data-wave={waving} className="group/cta relative isolate inline-flex">
      <Hand side="left" />
      {children}
      <Hand side="right" />
    </span>
  );
}
