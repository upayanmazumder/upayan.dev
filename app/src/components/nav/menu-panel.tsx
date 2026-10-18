'use client';

import { useRef, type RefObject } from 'react';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

import { MenuGround } from './menu-ground';
import { MenuHologram } from './menu-hologram';

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
      const links = root.querySelectorAll('[data-holo-link]');
      const aliens = root.querySelectorAll('[data-alien]');
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
        current.timeScale(1.7).reverse();
        return;
      }

      // Re-opened mid-close: play forward from where it is.
      if (current && current.reversed() && current.progress() > 0) {
        current.eventCallback('onReverseComplete', null);
        current.timeScale(1).play();
        return;
      }
      current?.kill();

      gsap.set(root, { autoAlpha: 1 });
      const firstLink = root.querySelector<HTMLElement>('[data-holo-link] a');

      if (prefersReducedMotion()) {
        timeline.current = null;
        gsap.set([backdrop, content, hologram, ...links, ...aliens], { autoAlpha: 1 });
        if (saucer) gsap.set(saucer, { y: 48, scale: 1.5 });
        firstLink?.focus();
        return;
      }

      // Aim the beam's apex at the saucer.
      const rect = tab?.getBoundingClientRect();
      gsap.set(hologram, { x: rect ? rect.left + rect.width / 2 - window.innerWidth / 2 : 0 });

      // Strictly in order, and reversed on close: sky, ground, saucer into place, beam on, pages,
      // then the aliens. Closing therefore drops the aliens, then the pages, switches the beam off,
      // and only then lets the saucer fly back up.
      timeline.current = gsap
        .timeline()
        .set(content, { autoAlpha: 1 })
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' })
        .fromTo(ground, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' })
        .fromTo(
          saucer,
          { y: 0, scale: 1 },
          { y: 48, scale: 1.5, duration: 0.55, ease: 'back.out(1.6)' }
        )
        .fromTo(
          hologram,
          { scaleY: 0, autoAlpha: 0 },
          { scaleY: 1, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }
        )
        // The projector catching: a few quick flickers before the image settles.
        .to(hologram, { autoAlpha: 0.45, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' })
        .fromTo(
          links,
          { autoAlpha: 0, y: 14, filter: 'blur(6px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.4,
            stagger: 0.06,
            ease: 'power3.out',
          }
        )
        .fromTo(
          aliens,
          { autoAlpha: 0, y: 46 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.03, ease: 'back.out(2.2)' }
        );
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
