'use client';

import { useEffect, type RefObject } from 'react';

import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { afterReveal, REVEALED_CLASS } from '@/lib/page-load';

/** Set once the menu has been opened in this tab session; the cues then stop. */
const SEEN_KEY = 'ufo-menu-seen';
/** The landing hint waits this long after the reveal, so the saucer has settled into its dock. */
const HINT_DELAY_MS = 1200;
/** How long the landing hint's bubble stays readable. */
const HINT_HOLD_S = 2.6;
/** Gap between idle peeks. */
const PEEK_EVERY_MS = 12_000;
/** The scroll nudge fires once the visitor scrolls this share of the viewport past the top. */
const NUDGE_AT = 0.8;

function seen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage can be blocked; the cues then run again on the next load.
  }
}

/**
 * Teaches new visitors that the docked saucer is the menu, until they open it once this session.
 * After landing it drops into view with a "Menu's in here" bubble. Every 12 seconds it dips, its
 * lights flare, and a ring pulses under it. The first scroll past the hero earns one extra dip.
 * `hint` is a wrapper around the saucer that no other animation moves. Nothing runs with reduced
 * motion, while the menu shows, or while the tab is hidden.
 */
export function useUfoHint(hint: RefObject<HTMLElement | null>, menuShown: boolean) {
  useEffect(() => {
    const root = hint.current;
    if (!root) return;
    if (menuShown) {
      markSeen();
      return;
    }
    if (seen() || prefersReducedMotion()) return;

    const bubble = root.querySelector('[data-ufo-bubble]');
    const ring = root.querySelector('[data-ufo-ring]');
    let active: gsap.core.Timeline | null = null;
    let lastCue = performance.now();
    let nudged = false;

    // Drop into view, flare the lights, and pulse a ring; rise back after `hold` seconds.
    const dip = (depth: number, hold: number) =>
      gsap
        .timeline()
        .to(root, { y: depth, duration: 0.55, ease: 'back.out(1.8)' })
        .to(
          root,
          { filter: 'brightness(1.9)', duration: 0.12, repeat: 3, yoyo: true, ease: 'none' },
          '<0.2'
        )
        .fromTo(
          ring,
          { scale: 0.4, autoAlpha: 0.8 },
          { scale: 1.9, autoAlpha: 0, duration: 0.9, ease: 'power2.out' },
          '<'
        )
        .addLabel('rise', `+=${hold}`)
        .to(root, { y: 0, duration: 0.6, ease: 'power2.inOut' }, 'rise');

    const play = (timeline: gsap.core.Timeline) => {
      if (active?.isActive()) {
        timeline.kill();
        return false;
      }
      active = timeline;
      lastCue = performance.now();
      return true;
    };

    const landing = afterReveal(HINT_DELAY_MS, () => {
      const timeline = dip(26, HINT_HOLD_S)
        .fromTo(
          bubble,
          { autoAlpha: 0, y: -6, scale: 0.9 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(2)' },
          0.35
        )
        .to(bubble, { autoAlpha: 0, y: -4, duration: 0.25, ease: 'power2.in' }, 'rise-=0.1');
      play(timeline);
    });

    const revealed = () => document.documentElement.classList.contains(REVEALED_CLASS);

    const peek = window.setInterval(() => {
      if (!revealed() || document.visibilityState !== 'visible') return;
      if (performance.now() - lastCue < PEEK_EVERY_MS) return;
      play(dip(14, 0.5));
    }, 1000);

    const onScroll = () => {
      if (nudged || !revealed() || window.scrollY < window.innerHeight * NUDGE_AT) return;
      nudged = play(dip(22, 0.8));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      landing();
      window.clearInterval(peek);
      window.removeEventListener('scroll', onScroll);
      active?.kill();
      gsap.set(root, { y: 0, filter: 'none' });
      gsap.set([bubble, ring], { autoAlpha: 0 });
    };
  }, [hint, menuShown]);
}
