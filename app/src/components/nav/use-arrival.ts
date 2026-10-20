'use client';

import { useEffect, type RefObject } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { REVEALED_CLASS, REVEALED_EVENT } from '@/lib/page-load';

import { departScene, findParts, introScene, uplinkScene } from './arrival-scenes';
import { preloadPage } from './preload-page';
import { uplinkMeter } from './uplink-meter';

/** A slow network never holds the page past this, counted from the start of the show. */
const MAX_MS = 9000;

function after(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  window.setTimeout(resolve, ms);
  return promise;
}

/**
 * Plays the arrival on every full page load (see `arrival-scenes.ts` for each act). While act one
 * plays, the page downloads its assets and live data, and the uplink bar shows that progress. When
 * act one has run and the downloads are done (or `MAX_MS` has passed), the bar completes, the
 * saucer climbs to its dock, and the night lifts to reveal the page. Reduced motion skips the show
 * and the downloads, and docks the saucer at once.
 */
export function useArrival(
  saucer: RefObject<HTMLElement | null>,
  overlay: RefObject<HTMLElement | null>
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ship = saucer.current;
    const layer = overlay.current;
    if (!ship || !layer) return;

    const html = document.documentElement;
    const reveal = () => {
      html.classList.add(REVEALED_CLASS);
      window.dispatchEvent(new Event(REVEALED_EVENT));
    };
    if (prefersReducedMotion()) {
      ship.setAttribute('data-armed', 'true');
      reveal();
      return;
    }

    const parts = findParts(ship, layer);
    const geometry = {
      vw: window.innerWidth,
      vh: window.innerHeight,
      hoverY: window.innerHeight * 0.45 - (ship.offsetTop + ship.offsetHeight / 2),
    };
    ship.setAttribute('data-arrival', 'true');
    // Not a button yet: no clicks, hover, or keyboard focus until it has docked.
    ship.setAttribute('inert', '');
    const meter = uplinkMeter(parts.bar, parts.percent);
    const intro = introScene(parts, geometry, meter);
    ship.setAttribute('data-armed', 'true');

    const { promise: introDone, resolve } = Promise.withResolvers<void>();
    intro.timeline.eventCallback('onComplete', () => resolve());
    const loaded = Promise.race([preloadPage(queryClient, meter.progress), after(MAX_MS)]);

    let cancelled = false;
    let exit: gsap.core.Timeline | null = null;
    void Promise.all([loaded, introDone]).then(() => {
      if (cancelled) return;
      exit = gsap
        .timeline({
          onComplete: () => {
            ship.removeAttribute('data-arrival');
            ship.removeAttribute('inert');
            gsap.set(ship, { clearProps: 'all' });
          },
        })
        .add(uplinkScene(parts, meter))
        .add(() => {
          for (const loop of intro.loops) loop.kill();
        })
        .add(departScene(parts, geometry, reveal));
    });

    return () => {
      cancelled = true;
      intro.timeline.kill();
      for (const loop of intro.loops) loop.kill();
      exit?.kill();
    };
  }, [saucer, overlay, queryClient]);
}
