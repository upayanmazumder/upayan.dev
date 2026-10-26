'use client';

import { gsap } from '@/lib/gsap';

export interface UplinkMeter {
  /** Real progress from the preload, from 0 to 1. */
  progress: (share: number) => void;
  /** The paced fill, for the intro timeline. */
  pace: (duration: number) => gsap.core.Tween;
  /** Takes the bar the rest of the way once everything has loaded. */
  finish: () => gsap.core.Tween;
}

/**
 * The uplink bar and its percentage. The bar shows the smaller of two values: the real share of
 * downloaded assets and a pace that fills over a fixed time. A fast network therefore still gets
 * a visible fill, and a slow one waits at its real progress.
 */
export function uplinkMeter(bar: Element | null, percent: Element | null): UplinkMeter {
  const shown = { value: 0 };
  const pace = { value: 0 };
  let real = 0;
  let finished = false;

  const paint = () => {
    gsap.set(bar, { scaleX: shown.value });
    if (percent) percent.textContent = `${Math.round(shown.value * 100)}%`;
  };
  const glide = gsap.quickTo(shown, 'value', {
    duration: 0.6,
    ease: 'power3.out',
    onUpdate: paint,
  });
  const sync = () => {
    if (!finished) glide(Math.min(real, pace.value));
  };

  return {
    progress(share) {
      real = share;
      sync();
    },
    pace(duration) {
      return gsap.to(pace, { value: 1, duration, ease: 'sine.inOut', onUpdate: sync });
    },
    finish() {
      finished = true;
      gsap.killTweensOf(shown);
      return gsap.to(shown, { value: 1, duration: 0.4, ease: 'power2.out', onUpdate: paint });
    },
  };
}
