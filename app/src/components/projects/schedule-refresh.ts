'use client';

import { ScrollTrigger } from '@/lib/gsap';

let timer = 0;

/**
 * Coalesces ScrollTrigger re-measures after page-height changes into one refresh once they settle.
 * Several sources (live data above the stack, the expandable grid) can fire together; each refresh
 * re-measures every trigger on the page, so they share one timer. `safe` waits for scrolling to stop.
 */
export function scheduleRefresh(delay = 200) {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => ScrollTrigger.refresh(true), delay);
}
