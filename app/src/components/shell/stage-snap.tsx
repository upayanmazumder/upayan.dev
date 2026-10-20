'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Snap from 'lenis/snap';

import { useLenis } from './smooth-scroll';

/**
 * Snapping only inside staged sections, with Lenis' own snap module: each screen of a stage
 * (`data-snap-stop`) is a stop, so its scene never rests halfway between two steps. The rest of
 * the page scrolls freely. Off with reduced motion, because Lenis is off.
 */
export function StageSnap() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    const stops = document.querySelectorAll<HTMLElement>('main [data-snap-stop]');
    if (!lenis || stops.length === 0) return;
    const snap = new Snap(lenis, {
      type: 'proximity',
      distanceThreshold: '20%',
      debounce: 260,
      duration: 0.7,
      easing: t => 1 - (1 - t) ** 3,
    });
    // Snap measures registered elements itself, including on resize.
    for (const stop of stops) snap.addElement(stop, { align: 'start' });
    return () => snap.destroy();
  }, [lenis, pathname]);

  return null;
}
