'use client';

import { useRef, type RefObject } from 'react';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { MenuGround } from './menu-ground';
import { MenuHologram } from './menu-hologram';
import { menuTimeline, SAUCER_DOWN } from './menu-timeline';

interface MenuPanelProps {
  id: string;
  open: boolean;
  /** The saucer button; it hovers lower while the menu is open and the beam starts under it. */
  tabRef: RefObject<HTMLButtonElement | null>;
  onClosed: () => void;
}

/**
 * Full-screen menu staged as a scene. The night sky fades in, the planet surface rises, the hovering
 * saucer throws a trapezium of light that flickers on as a hologram of the site pages, and a crowd
 * of aliens pops up on the ground holding contact and profile links. Closing plays it in reverse.
 */
export function MenuPanel({ id, open, tabRef, onClosed }: MenuPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current!;
      const backdrop = root.querySelector('[data-backdrop]');
      const content = root.querySelector('[data-menu-content]');
      const ground = root.querySelector('[data-ground]');
      const hologram = root.querySelector('[data-hologram]');
      const links = gsap.utils.toArray<Element>('[data-holo-link]', root);
      const aliens = gsap.utils.toArray<Element>('[data-alien]', root);
      const current = timeline.current;
      // The saucer sits in the menu button, outside this panel; it hovers lower while the menu shows.
      const tab = tabRef.current;
      const saucer = tab?.querySelector('[data-ufo-body]') ?? null;

      if (!open) {
        if (!current || prefersReducedMotion()) {
          current?.kill();
          timeline.current = null;
          gsap.set(root, { autoAlpha: 0 });
          if (saucer) gsap.set(saucer, { y: 0, scale: 1 });
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

      const firstLink = root.querySelector<HTMLElement>('[data-holo-link] a');

      // Re-opened mid-close: play forward from where it is. A link that still shows can take focus
      // now. A hidden one takes it when the timeline passes its focus step again.
      if (current && current.reversed() && current.progress() > 0) {
        current.eventCallback('onReverseComplete', null);
        current.timeScale(1).play();
        firstLink?.focus({ preventScroll: true });
        return;
      }
      current?.kill();

      gsap.set(root, { autoAlpha: 1 });

      // Start the beam at the lowered saucer's disc centre, so its top sits behind the disc with no
      // gap. The disc centre is 3px below the middle of the 28px-high saucer drawing.
      const rect = tab?.getBoundingClientRect();
      if (rect) {
        const discY = rect.top + rect.height / 2 + SAUCER_DOWN.y + 3 * SAUCER_DOWN.scale;
        gsap.set(root, { '--holo-top': `${discY}px` });
      }

      if (prefersReducedMotion()) {
        timeline.current = null;
        gsap.set([backdrop, content, hologram, ...links, ...aliens], { autoAlpha: 1 });
        if (saucer) gsap.set(saucer, SAUCER_DOWN);
        firstLink?.focus();
        return;
      }

      // Aim the beam's apex at the saucer.
      gsap.set(hologram, { x: rect ? rect.left + rect.width / 2 - window.innerWidth / 2 : 0 });
      gsap.set(content, { autoAlpha: 1 });

      timeline.current = menuTimeline({
        backdrop,
        ground,
        saucer,
        hologram,
        links,
        aliens,
        // A hidden link cannot take focus, so focus waits until the first page shows.
        onLinksShown: () => firstLink?.focus({ preventScroll: true }),
      });
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
      className="invisible fixed inset-0 z-50 [--ground:clamp(8.5rem,22vh,12rem)] [--holo-top:4.6rem]"
    >
      <div
        data-backdrop
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-background bg-[radial-gradient(70%_50%_at_50%_0%,var(--teal-dim),transparent_70%)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_12%_18%,var(--foreground),transparent),radial-gradient(1px_1px_at_32%_62%,var(--foreground),transparent),radial-gradient(1.5px_1.5px_at_58%_28%,var(--teal),transparent),radial-gradient(1px_1px_at_78%_44%,var(--foreground),transparent),radial-gradient(1px_1px_at_88%_14%,var(--accent-foreground),transparent),radial-gradient(1px_1px_at_24%_40%,var(--foreground),transparent)] bg-[length:380px_380px] opacity-50" />
      </div>
      <div
        data-menu-content
        data-lenis-prevent
        className="invisible relative h-full overflow-hidden"
      >
        <p className="label absolute top-6 left-6 md:top-8 md:left-8">Menu</p>
        <MenuHologram />
        <MenuGround />
      </div>
    </div>
  );
}
