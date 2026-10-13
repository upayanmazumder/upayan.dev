'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNowStrict } from 'date-fns';
import { m } from 'motion/react';

import { BrandIcon } from '@/components/ui/brand-icon';

import { LiveCard, LiveSkeleton, Unavailable } from './live-card';
import type { LiveSpotify } from './types';

interface SpotifyCardProps {
  data: LiveSpotify | null | undefined;
  loading: boolean;
  /** Epoch ms when `data` arrived; progress ticks forward from here between polls. */
  receivedAt: number;
  className?: string;
}

export function SpotifyCard({ data, loading, receivedAt, className }: SpotifyCardProps) {
  const aside =
    data?.state === 'playing' ? (
      <span className="flex items-center gap-2 text-teal">
        <Equalizer />
        Now playing
      </span>
    ) : data?.state === 'recent' ? (
      'Last played'
    ) : null;

  return (
    <LiveCard label="Spotify" aside={aside} className={className}>
      {loading ? (
        <LiveSkeleton />
      ) : !data ? (
        <Unavailable what="Spotify" />
      ) : data.state === 'idle' ? (
        <p className="flex flex-1 items-center text-sm text-muted-foreground">
          Nothing playing right now.
        </p>
      ) : (
        <div className="flex flex-1 items-center gap-4">
          <Cover art={data.track.art} album={data.track.album} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {data.track.url ? (
              <a
                href={data.track.url}
                target="_blank"
                rel="noreferrer"
                className="truncate font-ui font-semibold underline-offset-4 hover:text-teal hover:underline focus-visible:text-teal"
              >
                {data.track.title}
              </a>
            ) : (
              <p className="truncate font-ui font-semibold">{data.track.title}</p>
            )}
            <p className="truncate text-sm text-muted-foreground">
              {data.track.artists.join(', ')}
            </p>
            {data.state === 'playing' && data.progressMs !== null && data.track.durationMs ? (
              <Progress
                progressMs={data.progressMs}
                durationMs={data.track.durationMs}
                since={receivedAt}
              />
            ) : data.state === 'recent' && data.playedAt ? (
              <p className="font-mono text-xs text-muted-foreground/80">
                {formatDistanceToNowStrict(new Date(data.playedAt), { addSuffix: true })}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </LiveCard>
  );
}

function Cover({ art, album }: { art: string | null; album: string | null }) {
  if (!art) {
    return (
      <span className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-muted-foreground">
        <BrandIcon icon="siSpotify" name="Spotify" className="size-6" />
      </span>
    );
  }
  return (
    <Image
      src={art}
      alt={album ? `${album} cover` : ''}
      width={64}
      height={64}
      unoptimized
      className="size-16 shrink-0 rounded-lg border border-line object-cover"
    />
  );
}

const BARS = [0.55, 1, 0.7, 0.85];

function Equalizer() {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {BARS.map((peak, i) => (
        <m.span
          key={i}
          className="h-full w-[2px] origin-bottom rounded-full bg-teal"
          initial={{ scaleY: 0.3 }}
          animate={{ scaleY: [0.3, peak, 0.45, peak * 0.8, 0.3] }}
          transition={{ duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </span>
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
  const [now, setNow] = useState(since);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [since]);

  const elapsed = Math.min(durationMs, progressMs + Math.max(0, now - since));
  return (
    <div className="mt-1 flex items-center gap-2 font-mono text-[0.7rem] text-muted-foreground tabular-nums">
      <span>{clock(elapsed)}</span>
      <span
        role="progressbar"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs / 1000)}
        aria-valuenow={Math.round(elapsed / 1000)}
        className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="absolute inset-0 origin-left bg-teal transition-transform duration-1000 ease-linear motion-reduce:transition-none"
          style={{ transform: `scaleX(${elapsed / durationMs})` }}
        />
      </span>
      <span>{clock(durationMs)}</span>
    </div>
  );
}
