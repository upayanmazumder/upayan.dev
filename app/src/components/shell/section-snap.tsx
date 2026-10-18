'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Snap from 'lenis/snap';

import { useLenis } from './smooth-scroll';
import { TRAIL_MIN_WIDTH } from './trail/roadmap-trail';

/**
 * Proximity snapping on wide screens with Lenis' own snap module: once a scroll settles near a trail
 * section, the section glides to the middle of the viewport with the trail entering above and
 * leaving below. A section taller than the viewport (an expanded grid) is left free so it can still
 * be read. Off with reduced motion, because Lenis is off then.
 */
export function SectionSnap() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const snap = new Snap(lenis, {
      type: 'proximity',
      distanceThreshold: '20%',
      debounce: 260,
      duration: 0.7,
      easing: t => 1 - (1 - t) ** 3,
    });
    const registered = new Map<HTMLElement, () => void>();
    let timer = 0;

    // Re-check which sections fit whenever the layout settles; Snap measures registered ones itself.
    const sync = () => {
      const wide = window.innerWidth >= TRAIL_MIN_WIDTH;
      for (const el of document.querySelectorAll<HTMLElement>('main section[data-trail-side]')) {
        const fits = wide && el.offsetHeight <= window.innerHeight;
        const remove = registered.get(el);
        if (fits && !remove) registered.set(el, snap.addElement(el, { align: 'center' }));
        if (!fits && remove) {
          remove();
          registered.delete(el);
        }
      }
    };
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sync, 300);
    };

    sync();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      snap.destroy();
    };
  }, [lenis, pathname]);

  return null;
}
