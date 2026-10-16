'use client';

import { cn } from '@/lib/utils';

import { DiscordTile } from './discord-tile';
import { MachineTile } from './machine-tile';
import { SpotifyTile } from './spotify-tile';
import { useAfterLoad } from './use-after-load';
import { useLive } from './use-live';
import { ZedTile } from './zed-tile';

/**
 * Hairline grid of live tiles: Spotify and Discord, then the machine and the Zed editor.
 * Polling starts once the page is idle after load.
 * A failed poll keeps the last good data; with no data at all the tiles read unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterLoad();
  const { data, isPending, isError, dataUpdatedAt } = useLive(started);
  const loading = isPending && !isError;

  return (
    <div
      className={cn(
        // 1px gaps over a line-coloured background draw the inner hairlines.
        'grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-5',
        className
      )}
    >
      <SpotifyTile
        data={data?.spotify}
        loading={loading}
        receivedAt={dataUpdatedAt}
        className="md:col-span-3"
      />
      <DiscordTile data={data?.discord} loading={loading} className="md:col-span-2" />
      <MachineTile
        data={data?.pc}
        loading={loading}
        receivedAt={dataUpdatedAt}
        className="md:col-span-2"
      />
      <ZedTile
        pc={data?.pc}
        loading={loading}
        receivedAt={dataUpdatedAt}
        className="md:col-span-3"
      />
    </div>
  );
}
