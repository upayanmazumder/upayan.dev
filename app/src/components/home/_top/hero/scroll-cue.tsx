'use client';

import { useRef, type MouseEvent } from 'react';

import { useLenis } from '@/components/shell/smooth-scroll';
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '@/lib/gsap';

const DELAY_S = 3;
const TEXT = 'scroll';

/**
 * Quiet hint at the bottom of the hero. It waits 3 s, then the letters drift in one by one and a
 * soft shimmer runs across them. It fades away for good once the visitor starts scrolling.
 */
export function ScrollCue() {
  const lenis = useLenis();
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe) return;
      const word = root.querySelector<HTMLElement>('[data-word]');
      const tick = root.querySelector('[data-tick]');
      if (!word || !tick) return;

      // contextSafe records tweens made after setup, so unmount reverts them with the rest.
      const hide = contextSafe(() => {
        gsap.to(root, { autoAlpha: 0, y: 6, duration: 0.6, ease: 'power2.out' });
      });
      const onScroll = () => {
        if (window.scrollY > 40) {
          hide();
          window.removeEventListener('scroll', onScroll);
        }
      };

      if (prefersReducedMotion()) {
        const call = gsap.delayedCall(DELAY_S, () => {
          gsap.set(root, { autoAlpha: 1 });
          window.addEventListener('scroll', onScroll, { passive: true });
        });
        return () => {
          call.kill();
          window.removeEventListener('scroll', onScroll);
        };
      }

      const split = SplitText.create(word, { type: 'chars' });
      const tl = gsap
        .timeline({
          delay: DELAY_S,
          onStart: () => {
            // Already past the hero: the hint has nothing left to teach.
            if (window.scrollY > 40) tl.kill();
            else gsap.set(root, { autoAlpha: 1 });
          },
        })
        .from(split.chars, {
          autoAlpha: 0,
          y: 8,
          filter: 'blur(4px)',
          stagger: 0.07,
          duration: 0.8,
          ease: 'expo.out',
        })
        .from(tick, { scaleY: 0, transformOrigin: 'top', duration: 0.6, ease: 'expo.out' }, '-=0.4')
        .add(
          contextSafe(() => {
            // Idle loop: a shimmer passes over the letters while the tick drips downward.
            gsap.to(split.chars, {
              color: 'var(--teal)',
              stagger: { each: 0.08, repeat: -1, yoyo: true, repeatDelay: 1.6 },
              duration: 0.5,
              ease: 'sine.inOut',
            });
            gsap.fromTo(
              tick,
              { yPercent: -100 },
              { yPercent: 100, duration: 1.6, ease: 'power2.inOut', repeat: -1, repeatDelay: 0.6 }
            );
            window.addEventListener('scroll', onScroll, { passive: true });
          })
        );
      return () => {
        tl.kill();
        split.revert();
        window.removeEventListener('scroll', onScroll);
      };
    },
    { scope: ref }
  );

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!lenis) return;
    event.preventDefault();
    lenis.scrollTo('#about', { duration: 1.4 });
  };

  return (
    <a
      ref={ref}
      href="#about"
      onClick={onClick}
      aria-label="Scroll to About"
      className="invisible absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground/80 opacity-0 transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      <span data-word>{TEXT}</span>
      <span aria-hidden className="relative h-5 w-px overflow-hidden">
        <span data-tick className="absolute inset-0 bg-linear-to-b from-transparent to-teal" />
      </span>
    </a>
  );
}
