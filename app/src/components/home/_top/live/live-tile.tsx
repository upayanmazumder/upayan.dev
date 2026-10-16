import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface LiveTileProps {
  label: string;
  icon: ReactNode;
  /** Short state at the top right, e.g. "Now playing". */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** One cell of the live grid: a small labelled header and the provider's content. */
export function LiveTile({ label, icon, aside, className, children }: LiveTileProps) {
  return (
    <article className={cn('flex min-w-0 flex-col gap-4 bg-background p-5', className)}>
      <header className="flex items-center justify-between gap-3">
        <h3 className="label flex items-center gap-2">
          <span className="flex size-4 items-center justify-center">{icon}</span>
          {label}
        </h3>
        {aside ? (
          <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
            {aside}
          </span>
        ) : null}
      </header>
      {children}
    </article>
  );
}

/** Small teal dot marking something happening right now. Pulses gently unless motion is reduced. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 animate-pulse rounded-full bg-teal motion-reduce:animate-none',
        className
      )}
    />
  );
}

/** Calm state for a provider that did not answer. */
export function TileUnavailable({ what }: { what: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">Unavailable</p>
      <p className="text-xs text-muted-foreground/70">{what} is not reachable right now.</p>
    </div>
  );
}

/** Placeholder bars while the first poll is in flight. */
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
