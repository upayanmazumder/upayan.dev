'use client';

import { BrandIcon } from '@/components/ui/brand-icon';

import { LiveTile, TileSkeleton, TileUnavailable } from './live-tile';
import type { LivePc } from './types';
import { useNow } from './use-now';

interface ZedTileProps {
  /** Editor activity rides on the signed PC report. */
  pc: LivePc | null | undefined;
  loading: boolean;
  /** Epoch ms when `pc` arrived; the session timer ticks forward from here. */
  receivedAt: number;
  className?: string;
}

export function ZedTile({ pc, loading, receivedAt, className }: ZedTileProps) {
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
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate font-mono text-base text-foreground">{zed.file}</p>
            <p className="truncate text-sm text-muted-foreground">
              in <span className="text-foreground">{zed.workspace}</span>
            </p>
          </div>
          <Session activeSeconds={zed.activeSeconds} lastSeen={pc.lastSeen} since={receivedAt} />
        </div>
      )}
    </LiveTile>
  );
}

/** Session timer, ticking every second. */
function Session({
  activeSeconds,
  lastSeen,
  since,
}: {
  activeSeconds: number;
  lastSeen: number;
  since: number;
}) {
  const now = useNow(since);
  // `activeSeconds` was measured when the report was signed; add the time since then.
  const total = Math.max(0, Math.floor(activeSeconds + now / 1000 - lastSeen));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return (
    <span
      role="timer"
      aria-label={`Session ${hours} hours ${minutes} minutes ${seconds} seconds`}
      className="shrink-0 font-mono text-sm text-muted-foreground tabular-nums"
    >
      <span aria-hidden>
        {hours > 0 ? `${hours}:` : ''}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </span>
  );
}
