import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Decrypt } from '../hero/decrypt';

interface LiveRowProps {
  /** Provider name, announced to screen readers and shown on hover over the icon. */
  label: string;
  icon: ReactNode;
  /** Image icons fill the tile edge to edge; glyphs sit centered with padding. */
  fill?: boolean;
  /** Round tile, e.g. a spinning record. */
  round?: boolean;
  /** Image URL blurred behind the row as an ambient glow. */
  ambient?: string | null;
  /** Short mono text or graphic at the right edge. */
  meta?: ReactNode;
  loading: boolean;
  /** Position in the panel; drives the entrance stagger. */
  index: number;
  children: ReactNode;
}

/** One line of the live panel: icon tile, a single line of content, optional meta. */
export function LiveRow({
  label,
  icon,
  fill,
  round,
  ambient,
  meta,
  loading,
  index,
  children,
}: LiveRowProps) {
  return (
    <li
      style={{ '--i': index } as CSSProperties}
      className="relative flex h-13 translate-y-2 items-center gap-3 overflow-hidden px-3.5 opacity-0 blur-[2px] transition-[opacity,transform,filter] delay-[calc(var(--i)*140ms)] duration-700 ease-out-expo in-data-[shown=true]:translate-y-0 in-data-[shown=true]:opacity-100 in-data-[shown=true]:blur-none motion-reduce:transition-none"
    >
      {ambient ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 scale-150 bg-cover bg-center opacity-20 blur-2xl saturate-150"
          style={{ backgroundImage: `url("${ambient}")` }}
        />
      ) : null}
      <span
        title={label}
        className={cn(
          'relative flex size-8 shrink-0 items-center justify-center overflow-hidden border border-line bg-surface-2 text-muted-foreground',
          round ? 'rounded-full' : 'rounded-lg',
          fill && 'p-0'
        )}
      >
        {icon}
      </span>
      <span className="sr-only">{label}:</span>
      <div className="relative min-w-0 flex-1 text-sm">
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
        <span className="relative flex shrink-0 items-center font-mono text-[0.7rem] text-muted-foreground tabular-nums">
          {meta}
        </span>
      ) : null}
    </li>
  );
}

/** Live value that scrambles into place on arrival and again whenever it changes. */
export function Scramble({ text, className }: { text: string; className?: string }) {
  return <Decrypt key={text} text={text} className={className} />;
}

/** Quiet one-word state such as "Idle" or "Unavailable". */
export function Muted({ children }: { children: ReactNode }) {
  return <p className="truncate text-muted-foreground">{children}</p>;
}
