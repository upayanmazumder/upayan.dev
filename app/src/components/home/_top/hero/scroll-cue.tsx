'use client';

import type { MouseEvent } from 'react';
import { m } from 'motion/react';

import { useLenis } from '@/components/shell/smooth-scroll';

/** Bottom-of-hero hint that glides to the About section. */
export function ScrollCue() {
  const lenis = useLenis();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!lenis) return;
    event.preventDefault();
    lenis.scrollTo('#about', { duration: 1.4 });
  };

  return (
    <a
      href="#about"
      onClick={onClick}
      className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      <span className="label">Scroll</span>
      <span aria-hidden className="relative h-10 w-px overflow-hidden bg-line">
        <m.span
          className="absolute inset-x-0 top-0 h-1/2 bg-teal"
          initial={{ y: '-100%' }}
          animate={{ y: '200%' }}
          transition={{
            duration: 2.2,
            ease: [0.83, 0, 0.17, 1],
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        />
      </span>
    </a>
  );
}
