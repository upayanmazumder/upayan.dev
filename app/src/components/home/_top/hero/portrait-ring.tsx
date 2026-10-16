'use client';

import { useRef } from 'react';

import { useActive } from '@/hooks/use-active';

/** Slow conic sweep behind the portrait. The CSS spin pauses while the photo is offscreen or the tab is hidden. */
export function PortraitRing() {
  const ref = useRef<HTMLSpanElement>(null);
  const active = useActive(ref, '0px');

  return (
    <span
      ref={ref}
      aria-hidden
      data-active={active}
      className="absolute -inset-1/2 animate-spin bg-[conic-gradient(from_0deg,transparent_0deg,var(--teal)_60deg,transparent_120deg)] opacity-60 [animation-duration:16s] data-[active=false]:[animation-play-state:paused] motion-reduce:animate-none"
    />
  );
}
