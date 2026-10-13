'use client';

import Link from 'next/link';

import { profile } from '@/data/profile';
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

/** Fixed top-left monogram home link and palette trigger. */
export function TopMark({ paletteOpen, paletteId, covered }: TopMarkProps) {
  const modKey = useModKey();
  const toggle = useUiStore(state => state.toggle);
  const { onLinkClick } = useNavAction();

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
        aria-label="Open command palette"
        aria-haspopup="dialog"
        aria-expanded={paletteOpen}
        aria-controls={paletteOpen ? paletteId : undefined}
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          chip,
          'cursor-pointer gap-1 px-2.5 font-mono text-[0.6875rem] text-muted-foreground hover:text-foreground'
        )}
      >
        <kbd className="font-mono">{modKey}</kbd>
        <kbd className="font-mono">K</kbd>
      </button>
    </div>
  );
}
