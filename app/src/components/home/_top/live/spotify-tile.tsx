'use client';

import { BrandIcon } from '@/components/ui/brand-icon';

import { shortDuration } from './format';
import { LiveDot, LiveTile, TileSkeleton, TileUnavailable } from './live-tile';
import type { LiveSpotify } from './types';
import { useNow } from './use-now';

interface SpotifyTileProps {
  data: LiveSpotify | null | undefined;
  loading: boolean;
  /** Epoch ms when `data` arrived; progress ticks forward from here between polls. */
  receivedAt: number;
  className?: string;
}

export function SpotifyTile({ data, loading, receivedAt, className }: SpotifyTileProps) {
  const track = data && data.state !== 'idle' ? data.track : null;

  return (
    <LiveTile
      label="Spotify"
      icon={<BrandIcon icon="siSpotify" name="Spotify" className="size-3.5" />}
      aside={
        data?.state === 'playing' ? (
          <>
            <LiveDot />
            Now playing
          </>
        ) : data?.state === 'recent' ? (
          'Last played'
        ) : null
      }
      className={className}
    >
      {loading ? (
        <TileSkeleton lines={3} />
      ) : !data ? (
        <TileUnavailable what="Spotify" />
      ) : !track ? (
        <p className="text-sm text-muted-foreground">Nothing playing right now.</p>
      ) : (
        <div className="flex items-center gap-4">
          {track.art ? (
            // Album art comes from Spotify's CDN at a fixed small size; the image optimizer adds nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={track.art}
              alt={track.album ? `${track.album} cover` : ''}
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              className="size-16 shrink-0 rounded-md border border-line bg-surface object-cover sm:size-20"
            />
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {track.url ? (
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-lg leading-tight font-medium underline-offset-4 transition-colors hover:text-teal hover:underline focus-visible:text-teal"
              >
                {track.title}
              </a>
            ) : (
              <p className="truncate text-lg leading-tight font-medium">{track.title}</p>
            )}
            <p className="truncate text-sm text-muted-foreground">{track.artists.join(', ')}</p>
            {track.album ? (
              <p className="truncate font-mono text-xs text-muted-foreground">{track.album}</p>
            ) : null}
            {data.state === 'playing' && data.progressMs !== null && track.durationMs ? (
              <Progress
                progressMs={data.progressMs}
                durationMs={track.durationMs}
                since={receivedAt}
              />
            ) : data.state === 'recent' && data.playedAt ? (
              <p className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
                {shortDuration((receivedAt - Date.parse(data.playedAt)) / 1000)} ago
              </p>
            ) : null}
          </div>
        </div>
      )}
    </LiveTile>
  );
}

const clock = (ms: number) => {
  const total = Math.floor(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

function Progress({
  progressMs,
  durationMs,
  since,
}: {
  progressMs: number;
  durationMs: number;
  since: number;
}) {
  const now = useNow(since);
  const elapsed = Math.min(durationMs, progressMs + (now - since));
  return (
    <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted-foreground tabular-nums">
      <span>{clock(elapsed)}</span>
      <span
        role="progressbar"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs / 1000)}
        aria-valuenow={Math.round(elapsed / 1000)}
        className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="block h-full bg-foreground/70"
          style={{ width: `${(elapsed / durationMs) * 100}%` }}
        />
      </span>
      <span>{clock(durationMs)}</span>
    </div>
  );
}
