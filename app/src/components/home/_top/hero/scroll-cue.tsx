'use client';

import { useRef, type MouseEvent } from 'react';

import { useLenis } from '@/components/shell/smooth-scroll';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { loadSplitText, type SplitTextPlugin } from '@/lib/gsap-split';

const DELAY_S = 1.6;
const TEXT = 'scroll';

/**
 * Quiet hint at the bottom of the hero. After the intro the letters fade in and a single soft
 * shimmer passes over them; the tick keeps dripping until the visitor scrolls, then the hint
 * fades away and its loop is killed for good.
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

      // Only loop in the cue; killed once the hint hides so nothing runs after the user scrolls past.
      let drip: gsap.core.Tween | null = null;

      // contextSafe records tweens made after setup, so unmount reverts them with the rest.
      const hide = contextSafe(() => {
        gsap.to(root, {
          autoAlpha: 0,
          y: 6,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            drip?.kill();
            drip = null;
          },
        });
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

      let cancelled = false;
      let timeline: gsap.core.Timeline | null = null;
      let cleanupSplit = () => {};
      const load = () => {
        if (cancelled) return;
        void loadSplitText()
          .then(
            contextSafe((SplitText: SplitTextPlugin) => {
              if (cancelled) return;
              const split = SplitText.create(word, { type: 'chars' });
              cleanupSplit = () => split.revert();
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
                  y: 6,
                  stagger: 0.04,
                  duration: 0.5,
                  ease: 'power3.out',
                })
                .from(
                  tick,
                  { scaleY: 0, transformOrigin: 'top', duration: 0.5, ease: 'power3.out' },
                  '-=0.3'
                )
                .to(split.chars, {
                  color: 'var(--teal)',
                  stagger: { each: 0.05, yoyo: true, repeat: 1 },
                  duration: 0.3,
                  ease: 'sine.inOut',
                })
                .add(
                  contextSafe(() => {
                    // rAF stops in hidden tabs, so this loop also idles while the tab is in the background.
                    drip = gsap.fromTo(
                      tick,
                      { yPercent: -100 },
                      {
                        yPercent: 100,
                        duration: 1.8,
                        ease: 'power2.inOut',
                        repeat: -1,
                        repeatDelay: 1.2,
                      }
                    );
                    window.addEventListener('scroll', onScroll, { passive: true });
                    // The visitor may have scrolled during the intro; hide at once instead of waiting.
                    onScroll();
                  })
                );
              timeline = tl;
            })
          )
          .catch(() => {
            if (cancelled) return;
            // Keep the anchor usable if the decorative text plugin cannot load.
            gsap.set(root, { autoAlpha: 1 });
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          });
      };
      const idle = window.requestIdleCallback?.(load, { timeout: 1200 });
      const timer = idle === undefined ? window.setTimeout(load, 300) : undefined;
      return () => {
        if (idle !== undefined) window.cancelIdleCallback(idle);
        if (timer !== undefined) window.clearTimeout(timer);
        cancelled = true;
        timeline?.kill();
        drip?.kill();
        cleanupSplit();
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
      data-scroll-cue
      className="invisible absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.7rem] tracking-[0.3em] text-muted-foreground/80 opacity-0 transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      <span data-word>{TEXT}</span>
      <span aria-hidden className="relative h-5 w-px overflow-hidden">
        <span data-tick className="absolute inset-0 bg-linear-to-b from-transparent to-teal" />
      </span>
    </a>
  );
}
