'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
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
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.9, anchors: { offset: -24 } });
    instance.on('scroll', ScrollTrigger.update);

    // Lenis only needs frames while it animates. Ticking it off gsap.ticker on demand lets the ticker sleep
    // when the page is idle instead of running a rAF loop for the page lifetime.
    let ticking = false;
    let fresh = false;
    // Lenis' own clock: steps are capped so a frame after sleep or a stall doesn't jump to the target.
    let clock = 0;
    const tick = (_time: number, deltaTime: number) => {
      clock += fresh ? 1000 / 60 : Math.min(deltaTime, 50);
      fresh = false;
      instance.raf(clock);
      if (instance.isScrolling !== 'smooth') {
        ticking = false;
        gsap.ticker.remove(tick);
      }
    };
    const wake = () => {
      if (ticking) return;
      ticking = true;
      fresh = true;
      gsap.ticker.add(tick);
    };
    // Every smooth scroll goes through scrollTo: wheel input, anchors, and programmatic calls alike.
    const scrollTo = instance.scrollTo.bind(instance);
    instance.scrollTo = (...args: Parameters<Lenis['scrollTo']>) => {
      scrollTo(...args);
      wake();
    };
    setCurrent(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setCurrent(null);
    };
  }, []);

  return children;
}
