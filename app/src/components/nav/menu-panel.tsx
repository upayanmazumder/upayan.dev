'use client';

import { useRef, type RefObject } from 'react';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { floodFrames } from './liquid-path';
import { MenuFooter } from './menu-footer';
import { MenuLinks } from './menu-links';

interface MenuPanelProps {
  id: string;
  open: boolean;
  /** The edge tab; the flood starts from its bulge. */
  tabRef: RefObject<HTMLButtonElement | null>;
  /** Called once the panel is fully closed, so the parent can unmount it. */
  onClosed: () => void;
}

/** Full-screen menu. A liquid wave floods from the edge tab, then links stagger in; closing reverses it. */
export function MenuPanel({ id, open, tabRef, onClosed }: MenuPanelProps) {
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

      // Re-opened mid-close: play forward from where it is.
      if (current && current.reversed() && current.progress() > 0) {
        current.eventCallback('onReverseComplete', null);
        current.timeScale(1).play();
        root.querySelector<HTMLElement>('[data-menu-item]')?.closest('a')?.focus();
        return;
      }
      current?.kill();

      const tab = tabRef.current?.getBoundingClientRect();
      const { innerWidth: vw, innerHeight: vh } = window;
      const frames = floodFrames(
        tab ? ((tab.top + tab.height / 2) / vh) * 100 : 50,
        tab ? ((tab.width * 0.6) / vw) * 100 : 3,
        tab ? (tab.height / vh) * 100 : 8
      );

      gsap.set(root, { autoAlpha: 1 });
      const firstLink = items[0]?.closest('a');

      if (prefersReducedMotion()) {
        timeline.current = null;
        gsap.set(paths, { attr: { d: frames.full } });
        gsap.set(content, { autoAlpha: 1 });
        gsap.set(items, { yPercent: 0 });
        gsap.set(fades, { opacity: 1, y: 0 });
        firstLink?.focus();
        return;
      }

      // About 0.85s in total: the flood takes 0.4s and the links start rising before it settles.
      timeline.current = gsap
        .timeline()
        .set(paths, { attr: { d: frames.closed } })
        .set(content, { autoAlpha: 1 })
        .set(items, { yPercent: 105 })
        .set(fades, { opacity: 0, y: 12 })
        .to(paths, { attr: { d: frames.wave }, duration: 0.16, ease: 'power2.in' })
        .to(paths, { attr: { d: frames.full }, duration: 0.24, ease: 'power3.out' })
        .to(items, { yPercent: 0, duration: 0.45, stagger: 0.03, ease: 'power3.out' }, '-=0.15')
        .to(fades, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }, '<0.1');
      firstLink?.focus({ preventScroll: true });
    },
    { dependencies: [open], scope: rootRef }
  );

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
        <path data-flood d={floodFrames(50, 0, 0).closed} className="fill-background" />
        <path
          data-flood
          d={floodFrames(50, 0, 0).closed}
          className="fill-none stroke-teal/50"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        data-menu-content
        data-lenis-prevent
        className="invisible relative flex h-full flex-col overflow-y-auto overscroll-contain px-(--gutter) pt-6 pb-6 md:px-16 md:pt-12 md:pr-28 md:pb-8"
      >
        <p data-menu-fade className="label mb-2 md:mb-0">
          Menu
        </p>
        <div className="flex flex-1 items-center py-4 md:py-8">
          <MenuLinks />
        </div>
        <MenuFooter />
      </div>
    </div>
  );
}
