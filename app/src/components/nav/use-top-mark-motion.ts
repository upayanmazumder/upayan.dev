'use client';

import { useRef, type RefObject } from 'react';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { afterReveal } from '@/lib/page-load';

/** The chips enter once the saucer has docked, which is this long after the reveal. */
const ENTER_MS = 800;
/** The shortcut is taught once: visible this long after the chips enter, then it folds away. */
const HINT_MS = 2600;

interface TopMarkMotion {
  /** Unfolds the shortcut hint, on hover or focus. */
  unfold: () => void;
  /** Folds it back, once the intro hint has run. */
  refold: () => void;
}

/** Entrance of the top-left chips and the fold of the search chip's shortcut hint. */
export function useTopMarkMotion(
  rootRef: RefObject<HTMLDivElement | null>,
  buttonRef: RefObject<HTMLButtonElement | null>
): TopMarkMotion {
  const fold = useRef<gsap.core.Timeline | null>(null);

  // The chip folds with clip-path plus a sliding end cap that redraws its right border, so nothing animates layout.
  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const button = buttonRef.current;
      const keys = button?.querySelector<HTMLElement>('[data-keys]');
      const cap = button?.querySelector('[data-cap]');
      if (!root || !button || !keys || !cap) return;
      const radius = getComputedStyle(button).borderTopLeftRadius;
      const folded = () =>
        keys.offsetWidth ? keys.offsetWidth + parseFloat(getComputedStyle(keys).marginLeft) : 0;
      const tl = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.55, ease: 'power3.inOut', immediateRender: false },
          // Unclipped at rest so the focus outline is not cut off.
          onReverseComplete: () => {
            gsap.set(button, { clearProps: 'clipPath' });
          },
        })
        .to(keys.querySelectorAll('kbd'), {
          yPercent: -70,
          autoAlpha: 0,
          filter: 'blur(3px)',
          stagger: 0.06,
          duration: 0.32,
          ease: 'power2.in',
        })
        .set(cap, { autoAlpha: 1 }, '-=0.18')
        .fromTo(
          button,
          { clipPath: `inset(0px 0px 0px 0px round ${radius})` },
          { clipPath: () => `inset(0px ${folded()}px 0px 0px round ${radius})` },
          '<'
        )
        .fromTo(cap, { x: 0 }, { x: () => -folded() }, '<');
      fold.current = tl;

      if (prefersReducedMotion()) return afterReveal(HINT_MS, () => tl.progress(1));

      // Set the hidden state at the reveal, while the night still covers the top of the screen.
      const enter = contextSafe!(() => {
        gsap.fromTo(
          root.children,
          { autoAlpha: 0, y: -12, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.09,
            delay: ENTER_MS / 1000,
            clearProps: 'transform,filter',
          }
        );
      });
      const cancelEnter = afterReveal(0, enter);
      const cancelFold = afterReveal(ENTER_MS + HINT_MS, () => tl.play());
      return () => {
        cancelEnter();
        cancelFold();
      };
    },
    { scope: rootRef }
  );

  // Both only steer the existing timeline, so they need no GSAP context.
  return {
    unfold: () => {
      const tl = fold.current;
      if (tl && tl.progress() > 0) tl.timeScale(1.15).reverse();
    },
    refold: () => {
      const tl = fold.current;
      if (tl && tl.progress() > 0) tl.timeScale(1).play();
    },
  };
}
