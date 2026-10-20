'use client';

import { useEffect, type RefObject } from 'react';

import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Scrubs a stack of cards to the scroll through their staged section: each later card slides up
 * over the one before, which sinks back and dims. The card in front is the only one that can be
 * reached by keyboard or pointer; `onActive` hears when the front card changes. Reduced motion
 * leaves the cards in normal flow.
 */
export function useStackScroll(
  ref: RefObject<HTMLElement | null>,
  onActive: (index: number) => void
) {
  useEffect(() => {
    const root = ref.current;
    const section = root?.closest('section');
    const cards = root ? gsap.utils.toArray<HTMLElement>('[data-stack-card]', root) : [];
    if (!section || cards.length < 2 || prefersReducedMotion()) return;

    let active = -1;
    const pick = (index: number) => {
      if (index === active) return;
      active = index;
      cards.forEach((card, i) => {
        card.inert = i !== index;
      });
      onActive(index);
    };

    const last = cards.length - 1;
    gsap.set(cards, { clearProps: 'transform' });
    // A little past 100%, so queued cards clear the stage's bottom padding and never peek in.
    gsap.set(cards.slice(1), { yPercent: 112 });
    const timeline = gsap.timeline({
      defaults: { ease: 'none', duration: 1 },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: self => pick(Math.round(self.progress * last)),
      },
    });
    for (let i = 1; i <= last; i += 1) {
      // Dim with brightness, not opacity: a see-through card would show the one behind it.
      timeline
        .to(cards[i]!, { yPercent: 0 }, i - 1)
        .fromTo(
          cards[i - 1]!,
          { filter: 'brightness(1)' },
          { scale: 0.92, filter: 'brightness(0.4)' },
          i - 1
        );
    }
    pick(Math.round((timeline.scrollTrigger?.progress ?? 0) * last));

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      gsap.set(cards, { clearProps: 'transform,filter' });
      for (const card of cards) card.inert = false;
    };
  }, [ref, onActive]);
}
