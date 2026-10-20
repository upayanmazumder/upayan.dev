import { gsap } from '@/lib/gsap';

import { noise } from './alien-crew';

/** Where the saucer hovers while the menu is open, relative to its docked place. */
export const SAUCER_DOWN = { y: 48, scale: 1.5 };

interface MenuScene {
  backdrop: Element | null;
  ground: Element | null;
  saucer: Element | null;
  hologram: Element | null;
  links: Element[];
  aliens: Element[];
  /** Runs on the way in, once the first link is visible and can take focus. */
  onLinksShown: () => void;
}

// A projector catching: soft dips in brightness that fade out as the beam settles. It ends at 1.
const flicker = (p: number) => p * (1 - 0.45 * (1 - p) * Math.sin(5 * Math.PI * p) ** 2);

// The aliens pop up in a wave from the centre outward. A small stable jitter keeps it organic.
const waveDelay = (count: number) => (index: number) =>
  Math.abs(index - (count - 1) / 2) * 0.026 + noise(index, 12) * 0.04;

/**
 * The open sequence, about 1.35 s. The steps overlap so it flows: the sky fades while the ground
 * rises, the saucer comes down and settles, the beam projects down from it, the pages appear top to
 * bottom, and the aliens pop up last. Reversed, it drops the aliens first, then removes the pages,
 * switches the beam off, and lifts the saucer last.
 */
export function menuTimeline({
  backdrop,
  ground,
  saucer,
  hologram,
  links,
  aliens,
  onLinksShown,
}: MenuScene): gsap.core.Timeline {
  const timeline = gsap.timeline();
  return timeline
    .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'sine.out' }, 0)
    .fromTo(ground, { yPercent: 100 }, { yPercent: 0, duration: 0.75, ease: 'power3.out' }, 0.1)
    .fromTo(
      saucer,
      { y: 0, scale: 1 },
      { ...SAUCER_DOWN, duration: 0.55, ease: 'back.out(1.2)' },
      0
    )
    .fromTo(hologram, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, 0.35)
    .fromTo(hologram, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: flicker }, 0.35)
    .fromTo(
      links,
      { autoAlpha: 0, y: -10, filter: 'blur(6px)' },
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
      },
      0.55
    )
    .call(
      () => {
        if (!timeline.reversed()) onLinksShown();
      },
      undefined,
      0.57
    )
    .fromTo(
      aliens,
      { autoAlpha: 0, y: 44 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        ease: 'back.out(1.4)',
        stagger: waveDelay(aliens.length),
      },
      0.72
    );
}
