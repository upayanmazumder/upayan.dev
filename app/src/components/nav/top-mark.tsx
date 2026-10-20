'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

import { profile } from '@/data/profile';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

import { preloadPalette } from './lazy-overlays';
import { useModKey } from './use-mod-key';
import { useNavAction } from './use-nav-action';
import { useTopMarkMotion } from './use-top-mark-motion';

interface TopMarkProps {
  paletteOpen: boolean;
  paletteId: string;
  /** Hidden from focus and pointer while the menu covers it. */
  covered: boolean;
}

const ease = 'duration-500 ease-out-expo';
const chip = cn(
  'inline-flex h-9 items-center rounded-lg border border-line bg-background/60 backdrop-blur-md transition-[color,background-color,border-color,box-shadow,scale] hover:border-line-strong hover:bg-surface-2/70 hover:shadow-[0_6px_20px_-10px_var(--teal-dim)] focus-visible:border-line-strong active:scale-95',
  ease
);

/** Fixed top-left home link and palette trigger. They enter once the saucer has docked. */
export function TopMark({ paletteOpen, paletteId, covered }: TopMarkProps) {
  const modKey = useModKey();
  const toggle = useUiStore(state => state.toggle);
  const { onLinkClick } = useNavAction();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { unfold, refold } = useTopMarkMotion(rootRef, buttonRef);

  const engage = () => {
    preloadPalette();
    unfold();
  };

  return (
    <div
      ref={rootRef}
      inert={covered}
      className="fixed top-4 left-4 z-40 flex items-center gap-2 md:top-6 md:left-6"
    >
      <Link
        href="/"
        aria-label={`${profile.name}, home`}
        onClick={event => onLinkClick(event, '/')}
        className={cn(chip, 'group/home w-9 justify-center text-foreground hover:text-teal')}
      >
        <Home
          aria-hidden
          className={cn('size-4 transition-[translate] group-hover/home:-translate-y-0.5', ease)}
        />
      </Link>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => toggle('palette')}
        onPointerEnter={engage}
        onPointerLeave={refold}
        onFocus={engage}
        onBlur={refold}
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
        <Search
          aria-hidden
          className={cn(
            'size-3.5 shrink-0 transition-[rotate,scale] group-hover/search:scale-110 group-hover/search:-rotate-12',
            ease
          )}
        />
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
          className={cn(
            'pointer-events-none invisible absolute -inset-y-px -right-px w-2.5 rounded-r-lg border border-l-0 border-line transition-colors group-hover/search:border-line-strong group-focus-visible/search:border-line-strong',
            ease
          )}
        />
      </button>
    </div>
  );
}
