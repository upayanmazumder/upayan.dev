'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Snap from 'lenis/snap';

import { useLenis } from './smooth-scroll';
import { TRAIL_MIN_WIDTH } from './trail/roadmap-trail';

/**
 * Proximity snapping on wide screens: a scroll that ends near a trail section settles it in the
 * middle of the viewport, with the trail entering above and leaving below. A section taller than
 * the viewport (an expanded grid) is left free so its content can still be read. Off with reduced
 * motion, because Lenis is off then.
 */
export function SectionSnap() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    const snap = new Snap(lenis, { type: 'proximity', distanceThreshold: '25%', debounce: 220 });
    let removers: (() => void)[] = [];
    let frame = 0;

    const register = () => {
      for (const remove of removers) remove();
      removers = [];
      if (window.innerWidth < TRAIL_MIN_WIDTH) return;
      const hero = document.getElementById('hero');
      if (hero) removers.push(snap.addElement(hero, { align: 'start' }));
      for (const el of document.querySelectorAll<HTMLElement>('main section[data-trail-side]')) {
        if (el.offsetHeight <= window.innerHeight) {
          removers.push(snap.addElement(el, { align: 'center' }));
        }
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(register);
    };

    register();
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      snap.destroy();
    };
  }, [lenis, pathname]);

  return null;
}
