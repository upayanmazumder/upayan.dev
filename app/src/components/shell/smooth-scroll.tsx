'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

// One Lenis per page. Kept in a tiny external store so consumers re-render when it mounts.
let current: Lenis | null = null;
const listeners = new Set<() => void>();

function setCurrent(next: Lenis | null) {
  current = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Lenis instance, or null when reduced motion is on or before mount. */
export function useLenis() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: { offset: -24 } });
    instance.on('scroll', ScrollTrigger.update);
    // The integration Lenis documents for GSAP: one clock drives both, so snaps, trail tweens and
    // ScrollTrigger always agree on the frame.
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setCurrent(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setCurrent(null);
    };
  }, []);

  // Router scrolls and hash jumps move the page natively; re-read the real position once they land so
  // the next wheel tick does not glide from a stale target.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (current && !current.isScrolling) current.resize();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return children;
}
