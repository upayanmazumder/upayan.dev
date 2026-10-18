'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

import { profile } from '@/data/profile';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

import { preloadPalette } from './lazy-overlays';
import { useModKey } from './use-mod-key';
import { useNavAction } from './use-nav-action';

interface TopMarkProps {
  paletteOpen: boolean;
  paletteId: string;
  /** Hidden from focus and pointer while the menu covers it. */
  covered: boolean;
}

const chip =
  'inline-flex h-9 items-center rounded-lg border border-line bg-background/60 backdrop-blur-md transition-colors hover:border-line-strong focus-visible:border-line-strong';

// The shortcut is taught once: visible on arrival, then it folds away into the search icon.
const HINT_MS = 2500;

/** Fixed top-left monogram home link and palette trigger. */
export function TopMark({ paletteOpen, paletteId, covered }: TopMarkProps) {
  const modKey = useModKey();
  const toggle = useUiStore(state => state.toggle);
  const { onLinkClick } = useNavAction();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fold = useRef<gsap.core.Timeline | null>(null);

  // The chip folds with clip-path plus a sliding end cap that redraws its right border, so nothing animates layout.
  useGSAP(
    () => {
      const button = buttonRef.current;
      const keys = button?.querySelector<HTMLElement>('[data-keys]');
      const cap = button?.querySelector('[data-cap]');
      if (!button || !keys || !cap) return;
      const radius = getComputedStyle(button).borderTopLeftRadius;
      const folded = () =>
        keys.offsetWidth ? keys.offsetWidth + parseFloat(getComputedStyle(keys).marginLeft) : 0;
      const tl = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.35, ease: 'power3.inOut', immediateRender: false },
          // Unclipped at rest so the focus outline is not cut off.
          onReverseComplete: () => {
            gsap.set(button, { clearProps: 'clipPath' });
          },
        })
        .to(keys.querySelectorAll('kbd'), {
          yPercent: -100,
          autoAlpha: 0,
          stagger: 0.04,
          duration: 0.25,
          ease: 'power2.in',
        })
        .set(cap, { autoAlpha: 1 }, '-=0.1')
        .fromTo(
          button,
          { clipPath: `inset(0px 0px 0px 0px round ${radius})` },
          { clipPath: () => `inset(0px ${folded()}px 0px 0px round ${radius})` },
          '<'
        )
        .fromTo(cap, { x: 0 }, { x: () => -folded() }, '<');
      fold.current = tl;
      if (prefersReducedMotion()) {
        const id = window.setTimeout(() => tl.progress(1), HINT_MS);
        return () => window.clearTimeout(id);
      }
      const call = gsap.delayedCall(HINT_MS / 1000, () => {
        tl.play();
      });
      return () => call.kill();
    },
    { scope: buttonRef }
  );

  // Hover or focus unfolds the hint again; leaving folds it back once the intro hint has run.
  // Both only steer the existing timeline, so they need no GSAP context.
  const reveal = () => {
    const tl = fold.current;
    if (tl && tl.progress() > 0) tl.reverse();
  };
  const conceal = () => {
    const tl = fold.current;
    if (tl && tl.progress() > 0) tl.play();
  };

  return (
    <div
      inert={covered}
      className="fixed top-4 left-4 z-40 flex items-center gap-2 md:top-6 md:left-6"
    >
      <Link
        href="/"
        aria-label={`${profile.name}, home`}
        onClick={event => onLinkClick(event, '/')}
        className={cn(chip, 'w-9 justify-center text-foreground hover:text-teal')}
      >
        <Home aria-hidden className="size-4" />
      </Link>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => toggle('palette')}
        onPointerEnter={() => {
          preloadPalette();
          reveal();
        }}
        onPointerLeave={conceal}
        onFocus={() => {
          preloadPalette();
          reveal();
        }}
        onBlur={conceal}
        aria-label="Open command palette"
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        aria-controls={paletteOpen ? paletteId : undefined}
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          chip,
          'group/search relative cursor-pointer px-2.5 font-mono text-[0.6875rem] text-muted-foreground hover:text-foreground'
        )}
      >
        <Search aria-hidden className="size-3.5 shrink-0" />
        <span
          data-keys
          aria-hidden
          className="ml-1.5 inline-flex gap-1 overflow-hidden whitespace-nowrap pointer-coarse:hidden"
        >
          <kbd className="inline-block font-mono">{modKey}</kbd>
          <kbd className="inline-block font-mono">K</kbd>
        </span>
        <span
          data-cap
          aria-hidden
          className="pointer-events-none invisible absolute -inset-y-px -right-px w-2.5 rounded-r-lg border border-l-0 border-line transition-colors group-hover/search:border-line-strong group-focus-visible/search:border-line-strong"
        />
      </button>
    </div>
  );
}
