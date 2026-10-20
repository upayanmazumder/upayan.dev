'use client';

import { useEffect, type RefObject } from 'react';

import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { afterReveal, REVEALED_CLASS } from '@/lib/page-load';

/** Share of the viewport height, from the top, where the saucer notices the cursor. */
const ZONE = 0.15;
/** First shot this long after the page is revealed, once the saucer has docked and settled. */
const FIRST_SHOT_MS = 6000;
const FIRE_MIN_S = 30;
const FIRE_MAX_S = 45;
/** Retry delay when a shot is due but the saucer has no target or is still arriving. */
const RETRY_MS = 1000;
/** Pellet speed in px per second: slow enough to watch it travel and dodge it. */
const SPEED = 380;
/** Cursor within this distance of the saucer's centre provokes it; beyond FAR it fires back. */
const NEAR_PX = 70;
const FAR_PX = 240;
/** How long a provoked saucer glares after the cursor backs off before it fires. */
const GRUDGE_MS = 3000;
/** Hard floor between any two volleys, scheduled or retaliatory. */
const LOCK_MS = 7000;
/** Each volley is 2–3 pellets this far apart in time, scattered around the pointer. */
const BURST_GAP_S = 0.12;
const SPREAD_PX = 26;

/** When the last volley left, in `performance.now()` time; the lock counts from here. */
let lastShotAt = -Infinity;
/** When the next scheduled shot is due, in `performance.now()` time; 0 until the first one fires. */
let nextShotAt = 0;

/** True once the arrival animation has handed the saucer over to the page. */
const docked = (ship: Element) =>
  document.documentElement.classList.contains(REVEALED_CLASS) && !ship.hasAttribute('data-arrival');

/** One volley of 2–3 pellets, loosely aimed, so it reads as playful rather than a sniper shot. */
function volley(layer: HTMLElement, from: DOMRect, toX: number, toY: number) {
  const startX = from.left + from.width / 2;
  const startY = from.bottom - 4;
  const count = gsap.utils.random(2, 3, 1);

  for (let i = 0; i < count; i += 1) {
    const aimX = toX + gsap.utils.random(-SPREAD_PX, SPREAD_PX);
    const aimY = toY + gsap.utils.random(-SPREAD_PX, SPREAD_PX);
    const pellet = document.createElement('span');
    pellet.className = 'absolute top-0 left-0 size-1 -translate-1/2 rounded-full bg-white';
    layer.appendChild(pellet);
    // Queued pellets wait hidden at the muzzle, so nothing flashes in the corner during the delay.
    gsap.set(pellet, { x: startX, y: startY, autoAlpha: 0 });

    gsap
      .timeline({ delay: i * BURST_GAP_S, onComplete: () => pellet.remove() })
      .set(pellet, { autoAlpha: 1 })
      .to(pellet, {
        x: aimX,
        y: aimY,
        duration: Math.hypot(aimX - startX, aimY - startY) / SPEED,
        ease: 'none',
      })
      .to(pellet, { autoAlpha: 0, duration: 0.15 });
  }
}

/**
 * The docked saucer watches the cursor. In the top 15% of the screen it drops further out and leans
 * toward the pointer. It fires a volley of pellets at the pointer six seconds after the reveal,
 * then every 30–45 seconds. Hovering on or right around it (clicking excepted) provokes it: it goes
 * red and jitters, and once the cursor backs off it fires at once, skipping the cooldown. Paused
 * while the menu is open, the tab is hidden, the pointer is coarse or gone, or motion is reduced.
 */
export function useUfoPointer(
  ship: RefObject<HTMLElement | null>,
  lean: RefObject<HTMLElement | null>,
  pellets: RefObject<HTMLElement | null>,
  open: boolean
) {
  useEffect(() => {
    const button = ship.current;
    const body = lean.current;
    const layer = pellets.current;
    if (!button || !body || !layer || open || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // Long, soft follow-through so the lean drifts like something that floats, not a cursor clamp.
    const toX = gsap.quickTo(body, 'x', { duration: 1.1, ease: 'power2.out' });
    const toY = gsap.quickTo(body, 'y', { duration: 0.9, ease: 'power2.out' });
    const toTilt = gsap.quickTo(body, 'rotation', { duration: 1.2, ease: 'power2.out' });
    let pointer: { x: number; y: number } | null = null;
    let timer = 0;
    // Poking at the saucer (hovering on or right around it, not clicking) makes it angry. When the
    // cursor then backs off, it glares for three seconds, fires regardless of the cooldown, and calms.
    let angry = false;
    let grudge = 0;
    const setAngry = (value: boolean) => {
      angry = value;
      if (value) button.setAttribute('data-angry', 'true');
      else button.removeAttribute('data-angry');
    };

    const rest = () => {
      toX(0);
      toY(0);
      toTilt(0);
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      const rect = button.getBoundingClientRect();
      const centreX = rect.left + rect.width / 2;
      const gap = Math.hypot(event.clientX - centreX, event.clientY - (rect.top + rect.height / 2));
      if (docked(button)) {
        // Freshly fired and still reloading: it shrugs off pokes instead of holding a grudge.
        const reloading = performance.now() < lastShotAt + LOCK_MS;
        if (!angry && gap < NEAR_PX && !reloading) setAngry(true);
        else if (angry && gap > FAR_PX && !grudge) grudge = window.setTimeout(retaliate, GRUDGE_MS);
      }
      if (!docked(button) || event.clientY > window.innerHeight * ZONE) {
        rest();
        return;
      }
      const offset = event.clientX - centreX;
      toX(gsap.utils.clamp(-48, 48, offset * 0.08));
      toY(16);
      toTilt(gsap.utils.clamp(-14, 14, offset * 0.03));
    };
    // A click is a request, not a provocation.
    const onPress = () => {
      window.clearTimeout(grudge);
      grudge = 0;
      setAngry(false);
    };
    const onLeave = () => {
      pointer = null;
      rest();
    };

    const fireAndReload = () => {
      if (!pointer) return;
      volley(layer, button.getBoundingClientRect(), pointer.x, pointer.y);
      lastShotAt = performance.now();
      nextShotAt = lastShotAt + gsap.utils.random(FIRE_MIN_S, FIRE_MAX_S) * 1000;
      window.clearTimeout(timer);
      timer = window.setTimeout(shoot, nextShotAt - performance.now());
    };
    // If a scheduled volley went out during the glare, the lock is on: cool down without firing.
    const retaliate = () => {
      grudge = 0;
      setAngry(false);
      if (performance.now() < lastShotAt + LOCK_MS) return;
      if (document.visibilityState === 'visible') fireAndReload();
    };
    const shoot = () => {
      const locked = lastShotAt + LOCK_MS - performance.now();
      if (!pointer || !docked(button) || document.visibilityState !== 'visible' || locked > 0) {
        timer = window.setTimeout(shoot, Math.max(RETRY_MS, locked));
        return;
      }
      fireAndReload();
    };
    // The first volley counts from the reveal; later ones keep their schedule across menu toggles.
    let cancelFirst = () => {};
    if (nextShotAt === 0) cancelFirst = afterReveal(FIRST_SHOT_MS, shoot);
    else timer = window.setTimeout(shoot, Math.max(0, nextShotAt - performance.now()));

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    button.addEventListener('pointerdown', onPress);
    return () => {
      cancelFirst();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      button.removeEventListener('pointerdown', onPress);
      window.clearTimeout(timer);
      window.clearTimeout(grudge);
      setAngry(false);
      rest();
    };
  }, [ship, lean, pellets, open]);
}
