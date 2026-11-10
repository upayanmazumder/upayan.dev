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
 * The bar shows the smaller of real load progress and a paced fill.
 * A fast network still shows the fill. A slow one waits for the assets.
 */
export function uplinkMeter(bar: Element | null): UplinkMeter {
  const shown = { value: 0 };
  const pace = { value: 0 };
  let real = 0;
  let finished = false;

  const paint = () => {
    gsap.set(bar, { scaleX: shown.value });
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
