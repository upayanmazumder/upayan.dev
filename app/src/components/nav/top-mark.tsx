'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { profile } from '@/data/profile';
import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

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
const HINT_MS = 3500;

/** Fixed top-left monogram home link and palette trigger. */
export function TopMark({ paletteOpen, paletteId, covered }: TopMarkProps) {
  const modKey = useModKey();
  const toggle = useUiStore(state => state.toggle);
  const { onLinkClick } = useNavAction();
  const keysRef = useRef<HTMLSpanElement>(null);
  const fold = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const keys = keysRef.current;
      if (!keys) return;
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
        .to(keys.querySelectorAll('kbd'), {
          yPercent: -120,
          autoAlpha: 0,
          filter: 'blur(4px)',
          stagger: 0.06,
          duration: 0.45,
          ease: 'power3.in',
        })
        .to(keys, { width: 0, marginLeft: 0, duration: 0.6 }, '-=0.15');
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
    { scope: keysRef }
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
        className={cn(
          chip,
          'w-9 justify-center font-display text-base font-semibold text-foreground hover:text-teal'
        )}
      >
        U
      </Link>
      <button
        type="button"
        onClick={() => toggle('palette')}
        onPointerEnter={reveal}
        onPointerLeave={conceal}
        onFocus={reveal}
        onBlur={conceal}
        aria-label="Open command palette"
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        aria-controls={paletteOpen ? paletteId : undefined}
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          chip,
          'cursor-pointer px-2.5 font-mono text-[0.6875rem] text-muted-foreground hover:text-foreground'
        )}
      >
        <Search aria-hidden className="size-3.5 shrink-0" />
        <span
          ref={keysRef}
          aria-hidden
          className="ml-1.5 inline-flex gap-1 overflow-hidden whitespace-nowrap pointer-coarse:hidden"
        >
          <kbd className="inline-block font-mono">{modKey}</kbd>
          <kbd className="inline-block font-mono">K</kbd>
        </span>
      </button>
    </div>
  );
}
