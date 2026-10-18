'use client';

import Counter from '@/components/rb/Counter';
import { BrandIcon } from '@/components/ui/brand-icon';

import { LiveTile, Scramble, TileSkeleton, TileUnavailable } from './live-tile';
import type { LivePc } from './types';
import { useNow } from './use-now';

interface ZedTileProps {
  /** Editor activity rides on the signed PC report. */
  pc: LivePc | null | undefined;
  loading: boolean;
  /** Epoch ms when `pc` arrived; the session timer ticks forward from here. */
  receivedAt: number;
  /** Panel on screen and tab visible; the session timer and caret run only then. */
  active: boolean;
  className?: string;
}

export function ZedTile({ pc, loading, receivedAt, active, className }: ZedTileProps) {
  const zed = pc?.online ? pc.zed : null;

  return (
    <LiveTile
      label="Zed"
      icon={<BrandIcon icon="siZedindustries" name="Zed" className="size-3.5" />}
      className={className}
    >
      {loading ? (
        <TileSkeleton />
      ) : !pc ? (
        <TileUnavailable what="My editor" />
      ) : !zed ? (
        <p className="text-sm text-muted-foreground">Not in the editor right now.</p>
      ) : (
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="flex min-w-0 items-center font-mono text-lg text-foreground">
              <Scramble text={zed.file} className="truncate" />
              <span
                aria-hidden
                data-active={active}
                className="ml-1 inline-block h-5 w-[2px] shrink-0 animate-pulse bg-teal data-[active=false]:animate-none motion-reduce:animate-none"
              />
            </p>
            <p className="truncate text-sm text-muted-foreground">
              in <span className="text-foreground/85">{zed.workspace}</span>
            </p>
          </div>
          <Session
            activeSeconds={zed.activeSeconds}
            lastSeen={pc.lastSeen}
            since={receivedAt}
            active={active}
          />
        </div>
      )}
    </LiveTile>
  );
}

/** Session timer with rolling digits (React Bits Counter), ticking every second while active. */
function Session({
  activeSeconds,
  lastSeen,
  since,
  active,
}: {
  activeSeconds: number;
  lastSeen: number;
  since: number;
  active: boolean;
}) {
  const now = useNow(since, 1000, active);
  // `activeSeconds` was measured when the report was signed; add the time since then.
  const total = Math.max(0, Math.floor(activeSeconds + now / 1000 - lastSeen));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const digits = { fontSize: 22, gap: 0, horizontalPadding: 0, gradientHeight: 0, fontWeight: 600 };

  return (
    <span
      role="timer"
      aria-label={`Session ${hours} hours ${minutes} minutes ${seconds} seconds`}
      className="flex shrink-0 items-center font-mono text-accent-foreground tabular-nums"
    >
      <span aria-hidden className="flex items-center">
        {hours > 0 ? (
          <>
            <Counter
              value={hours}
              places={hours >= 10 ? [10, 1] : [1]}
              animate={active}
              {...digits}
            />
            <span className="px-0.5 text-lg text-muted-foreground">:</span>
          </>
        ) : null}
        <Counter value={minutes} places={[10, 1]} animate={active} {...digits} />
        <span className="px-0.5 text-lg text-muted-foreground">:</span>
        <Counter value={seconds} places={[10, 1]} animate={active} {...digits} />
      </span>
    </span>
  );
}
