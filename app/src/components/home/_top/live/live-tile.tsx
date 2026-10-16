import type { ReactNode } from 'react';

import BorderGlow from '@/components/rb/BorderGlow';
import { cn } from '@/lib/utils';

import { Decrypt } from '../hero/decrypt';

interface LiveTileProps {
  label: string;
  icon: ReactNode;
  /** Short state at the top right, e.g. "Now playing". */
  aside?: ReactNode;
  /** Layer behind the content, clipped to the tile, e.g. blurred album art. */
  backdrop?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Bento tile for the live section. The border glows toward the pointer (React Bits BorderGlow). */
export function LiveTile({ label, icon, aside, backdrop, className, children }: LiveTileProps) {
  return (
    <article data-tile className={cn('min-w-0', className)}>
      <BorderGlow
        backgroundColor="var(--surface)"
        borderRadius={16}
        glowColor="165 55 55"
        colors={['#6fd8bd', '#3fbfa0', '#c6f6e6']}
        glowRadius={20}
        glowIntensity={0.4}
        edgeSensitivity={25}
        fillOpacity={0.15}
        className="h-full w-full"
      >
        <div className="relative isolate flex h-full flex-col gap-3 overflow-hidden rounded-[15px] p-4">
          {backdrop ? (
            <div aria-hidden className="absolute inset-0 -z-10">
              {backdrop}
            </div>
          ) : null}
          <header className="flex items-center justify-between gap-3">
            <h3 className="label flex items-center gap-2">
              <span className="flex size-4 items-center justify-center text-muted-foreground">
                {icon}
              </span>
              {label}
            </h3>
            {aside ? (
              <span className="flex items-center gap-2 font-mono text-[0.65rem] text-muted-foreground tabular-nums">
                {aside}
              </span>
            ) : null}
          </header>
          {children}
        </div>
      </BorderGlow>
    </article>
  );
}

/** Calm state for a provider that did not answer. */
export function TileUnavailable({ what }: { what: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-ui text-sm text-muted-foreground">Unavailable</p>
      <p className="text-xs text-muted-foreground/70">{what} is not reachable right now.</p>
    </div>
  );
}

/** Shimmering bars while the first poll is in flight. */
export function TileSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div aria-hidden className="flex flex-col gap-2.5 py-1">
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="h-3 animate-pulse rounded bg-surface-2 motion-reduce:animate-none"
          style={{ width: `${70 - i * 22}%` }}
        />
      ))}
    </div>
  );
}

/** Live value that scrambles into place once on first view; later polls swap the text in plainly. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  return <Decrypt text={text} className={className} />;
}
