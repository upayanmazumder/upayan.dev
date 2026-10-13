import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface LiveRowProps {
  /** Provider name, announced to screen readers and shown on hover over the icon. */
  label: string;
  icon: ReactNode;
  /** Image icons fill the tile edge to edge; glyphs sit centered with padding. */
  fill?: boolean;
  /** Short mono text or graphic at the right edge. */
  meta?: ReactNode;
  loading: boolean;
  /** Position in the panel; drives the entrance stagger. */
  index: number;
  children: ReactNode;
}

/** One line of the live panel: icon tile, a single line of content, optional meta. */
export function LiveRow({ label, icon, fill, meta, loading, index, children }: LiveRowProps) {
  return (
    <li
      style={{ '--i': index } as CSSProperties}
      className="flex h-12 translate-y-2 items-center gap-3 px-3 opacity-0 blur-[2px] transition-[opacity,transform,filter] delay-[calc(var(--i)*140ms)] duration-700 ease-out-expo in-data-[shown=true]:translate-y-0 in-data-[shown=true]:opacity-100 in-data-[shown=true]:blur-none motion-reduce:transition-none"
    >
      <span
        title={label}
        className={cn(
          'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-2 text-muted-foreground',
          fill && 'p-0'
        )}
      >
        {icon}
      </span>
      <span className="sr-only">{label}:</span>
      <div className="min-w-0 flex-1 text-sm">
        {loading ? (
          <span
            aria-hidden
            className="block h-2.5 w-2/3 animate-pulse rounded bg-surface-2 motion-reduce:animate-none"
          />
        ) : (
          children
        )}
      </div>
      {meta && !loading ? (
        <span className="flex shrink-0 items-center font-mono text-[0.7rem] text-muted-foreground tabular-nums">
          {meta}
        </span>
      ) : null}
    </li>
  );
}

/** Quiet one-word state such as "Idle" or "Unavailable". */
export function Muted({ children }: { children: ReactNode }) {
  return <p className="truncate text-muted-foreground">{children}</p>;
}
