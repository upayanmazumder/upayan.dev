'use client';

import { useRef, type RefObject } from 'react';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { floodFrames } from './liquid-path';
import { MenuFooter } from './menu-footer';
import { MenuLinks } from './menu-links';

interface MenuSheetProps {
  id: string;
  open: boolean;
  /** The saucer button. The flood starts as a drop under it. The saucer itself does not move. */
  tabRef: RefObject<HTMLButtonElement | null>;
  /** Called once the sheet is fully closed, so the parent can unmount it. */
  onClosed: () => void;
}

/** Phone menu. Liquid pours down from the saucer and fills the screen, then the links rise in. */
export function MenuSheet({ id, open, tabRef, onClosed }: MenuSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const paths = root.querySelectorAll('[data-flood]');
      const content = root.querySelector('[data-menu-content]');
      const items = root.querySelectorAll('[data-menu-item]');
      const fades = root.querySelectorAll('[data-menu-fade]');
      const current = timeline.current;

      if (!open) {
        if (!current || prefersReducedMotion()) {
          current?.kill();
          timeline.current = null;
          gsap.set(root, { autoAlpha: 0 });
          onClosed();
          return;
        }
        current.eventCallback('onReverseComplete', () => {
          gsap.set(root, { autoAlpha: 0 });
          onClosed();
        });
        current.timeScale(1.6).reverse();
        return;
      }

      const firstLink = items[0]?.closest('a');

      // Re-opened mid-close: play forward from where it is.
      if (current && current.reversed() && current.progress() > 0) {
        current.eventCallback('onReverseComplete', null);
        current.timeScale(1).play();
        firstLink?.focus({ preventScroll: true });
        return;
      }
      current?.kill();

      const tab = tabRef.current?.getBoundingClientRect();
      const { innerWidth: vw, innerHeight: vh } = window;
      const frames = floodFrames(
        tab ? ((tab.left + tab.width / 2) / vw) * 100 : 50,
        tab ? (Math.max(tab.bottom, 0) / vh) * 100 : 4,
        tab ? ((tab.width * 0.5) / vw) * 100 : 8
      );

      gsap.set(root, { autoAlpha: 1 });

      if (prefersReducedMotion()) {
        timeline.current = null;
        gsap.set(paths, { attr: { d: frames.full } });
        gsap.set(content, { autoAlpha: 1 });
        gsap.set(items, { yPercent: 0 });
        gsap.set(fades, { opacity: 1, y: 0 });
        firstLink?.focus();
        return;
      }

      // The start states apply now, not on the first tick. The first link must be visible to take focus.
      gsap.set(paths, { attr: { d: frames.closed } });
      gsap.set(content, { autoAlpha: 1 });
      gsap.set(items, { yPercent: 105 });
      gsap.set(fades, { opacity: 0, y: 12 });

      // About 1s in total. The flood takes 0.45s and the links start to rise before it settles.
      timeline.current = gsap
        .timeline()
        .to(paths, { attr: { d: frames.wave }, duration: 0.2, ease: 'power2.in' })
        .to(paths, { attr: { d: frames.full }, duration: 0.25, ease: 'power3.out' })
        .to(items, { yPercent: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, '-=0.15')
        .to(
          fades,
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        );
      firstLink?.focus({ preventScroll: true });
    },
    { dependencies: [open], scope: rootRef }
  );

  const initial = floodFrames(50, 0, 0).closed;

  return (
    <div
      ref={rootRef}
      id={id}
      role="dialog"
      aria-label="Site menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-50"
    >
      <svg
        aria-hidden
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path data-flood d={initial} className="fill-background" />
        <path
          data-flood
          d={initial}
          className="fill-none stroke-teal/50"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The top padding keeps the content clear of the saucer, which stays docked above the sheet. */}
      <div
        data-menu-content
        data-lenis-prevent
        className="invisible relative flex h-full flex-col overflow-y-auto overscroll-contain px-(--gutter) pt-16 pb-6"
      >
        <p data-menu-fade className="label mb-2">
          Menu
        </p>
        <div className="flex flex-1 items-center py-4">
          <MenuLinks />
        </div>
        <MenuFooter />
      </div>
    </div>
  );
}
