import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface LiveCardProps {
  label: string;
  /** Short state shown at the top right, e.g. "Now playing". */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Shared frame for the live cards. */
export function LiveCard({ label, aside, className, children }: LiveCardProps) {
  return (
    <article
      className={cn(
        'flex min-h-36 flex-col gap-4 rounded-xl border border-line bg-surface/70 p-4 transition-colors hover:border-line-strong',
        className
      )}
    >
      <header className="flex items-center justify-between gap-3">
        <h3 className="label">{label}</h3>
        {aside ? (
          <div className="font-mono text-[0.7rem] text-muted-foreground">{aside}</div>
        ) : null}
      </header>
      {children}
    </article>
  );
}

/** Calm empty state when a provider did not answer. */
export function Unavailable({ what }: { what: string }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-1">
      <p className="font-ui text-sm text-muted-foreground">Unavailable</p>
      <p className="text-xs text-muted-foreground/70">{what} is not reachable right now.</p>
    </div>
  );
}

export function LiveSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-1 animate-pulse items-center gap-3 motion-reduce:animate-none"
    >
      <div className="size-14 rounded-lg bg-surface-2" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-2/3 rounded bg-surface-2" />
        <div className="h-3 w-1/3 rounded bg-surface-2" />
      </div>
    </div>
  );
}
