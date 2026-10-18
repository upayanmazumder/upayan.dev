'use client';

import { useEffect, type RefObject } from 'react';

import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { REVEALED_CLASS, REVEALED_EVENT } from '@/lib/page-load';

/** The preloader always holds the screen this long, whatever the network does. */
const MIN_MS = 3000;
/** A slow network never holds the page hostage past this. */
const MAX_MS = 4500;

function pageReady(): Promise<void> {
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>(resolve =>
          window.addEventListener('load', () => resolve(), { once: true })
        );
  const minimum = new Promise<void>(resolve => window.setTimeout(resolve, MIN_MS));
  const cap = new Promise<void>(resolve => window.setTimeout(resolve, MAX_MS));
  return Promise.all([minimum, Promise.race([loaded, cap])]).then(() => undefined);
}

/** Two quick bobs once docked, so the eye finds the peeking saucer. */
function settle(target: Element) {
  return gsap
    .timeline()
    .to(target, { y: 10, duration: 0.16, ease: 'power2.out' })
    .to(target, { y: 0, duration: 0.5, ease: 'bounce.out' })
    .to(target, { y: 5, duration: 0.12, ease: 'power2.out' }, '+=0.1')
    .to(target, { y: 0, duration: 0.4, ease: 'bounce.out' });
}

/**
 * Plays the arrival on every full page load, in two acts. First the night sky fades in, the scenery
 * pops into place, and the saucer swoops in from the top left to hover big in the middle, switch its
 * beam on, and bob while an uplink bar fills. Once the page has loaded and at least three seconds
 * have passed, it winds up and climbs to the top centre, shrinking as it goes, while the sky is
 * pulled up behind it to reveal the page. It docks peeking over the edge, bobs twice, and stays as
 * the menu button. Reduced motion skips straight to the dock.
 */
export function useArrival(
  saucer: RefObject<HTMLElement | null>,
  overlay: RefObject<HTMLElement | null>
) {
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

    const { innerWidth: vw, innerHeight: vh } = window;
    const dockY = ship.offsetTop + ship.offsetHeight / 2;
    const hoverY = vh * 0.45 - dockY;
    ship.setAttribute('data-arrival', 'true');
    // Not a button yet: no clicks, hover, or keyboard focus until it has docked.
    ship.setAttribute('inert', '');
    // Parked off-screen, top left, before it becomes visible.
    gsap.set(ship, {
      x: -vw * 0.7,
      y: hoverY - vh * 0.55,
      scale: 1.3,
      rotation: -22,
      autoAlpha: 0,
    });
    ship.setAttribute('data-armed', 'true');

    const stars = layer.querySelector('[data-stars]');
    const scenery = layer.querySelectorAll('[data-scenery] > div > *');
    const sceneryLayer = layer.querySelector('[data-scenery]');
    const bar = layer.querySelector('[data-bar]');
    const beam = layer.querySelector('[data-beam]');
    const uplink = layer.querySelector('[data-uplink]');
    gsap.set(bar, { scaleX: 0 });
    gsap.set(beam, { scaleY: 0 });
    gsap.set(uplink, { y: 10 });

    // Act one: night sky, then the scenery, then the saucer swoops in and switches its beam on.
    const intro = gsap
      .timeline()
      .to(stars, { opacity: 0.6, duration: 0.6, ease: 'power1.out' })
      .set(sceneryLayer, { opacity: 1 })
      .from(
        scenery,
        { autoAlpha: 0, scale: 0.4, duration: 0.5, stagger: 0.05, ease: 'back.out(1.8)' },
        '-=0.2'
      )
      .set(ship, { autoAlpha: 1 }, '-=0.2')
      .to(
        ship,
        {
          keyframes: [
            {
              x: -vw * 0.2,
              y: hoverY + 50,
              scale: 2.1,
              rotation: 10,
              duration: 0.7,
              ease: 'power2.in',
            },
            { x: 0, y: hoverY, scale: 2.6, rotation: 0, duration: 0.65, ease: 'back.out(1.7)' },
          ],
        },
        '<'
      )
      .to(beam, { scaleY: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
      .to(beam, { opacity: 0.4, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' })
      .to(uplink, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '<')
      .to(bar, { scaleX: 0.9, duration: 1.2, ease: 'power1.inOut' })
      // Idle hover while the page finishes loading: a lazy bob and a slow sweep of the beam.
      .to(ship, { y: hoverY - 10, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true }, '<')
      .to(
        beam,
        {
          rotation: 4,
          duration: 1.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          transformOrigin: '50% 0%',
        },
        '<'
      );
    const introDone = new Promise<void>(resolve => {
      intro.addLabel('ready', 3.2).call(resolve, [], 'ready');
    });
    let cancelled = false;
    let exit: gsap.core.Timeline | null = null;

    // Act two: once the page is ready and the show has run, the saucer climbs to its dock.
    void Promise.all([pageReady(), introDone]).then(() => {
      if (cancelled) return;
      intro.kill();
      exit = gsap
        .timeline({
          onComplete: () => {
            ship.removeAttribute('data-arrival');
            ship.removeAttribute('inert');
          },
        })
        .to(bar, { scaleX: 1, duration: 0.2, ease: 'power2.out' })
        .to(uplink, { opacity: 0, y: 8, duration: 0.25 }, '+=0.05')
        .to(beam, { scaleY: 0, opacity: 0, rotation: 0, duration: 0.3, ease: 'power2.in' }, '<')
        // Wind up with a small dip and tilt, then climb to the dock and shrink on the way.
        .to(ship, { y: hoverY + 16, rotation: 6, duration: 0.25, ease: 'power2.out' })
        .to(ship, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.9, ease: 'power3.inOut' })
        .to(scenery, { autoAlpha: 0, y: -40, duration: 0.5, stagger: 0.02, ease: 'power2.in' }, '<')
        .to(
          layer,
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power3.inOut' },
          '<0.1'
        )
        .set(layer, { display: 'none' })
        .call(reveal)
        .add(settle(ship));
    });

    return () => {
      cancelled = true;
      intro.kill();
      exit?.kill();
    };
  }, [saucer, overlay]);
}
