'use client';

import { useRef } from 'react';
import { m } from 'motion/react';

import TiltedCard from '@/components/rb/TiltedCard';
import { BrandIcon } from '@/components/ui/brand-icon';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { shortDuration } from './format';
import { LiveTile, Scramble, TileSkeleton, TileUnavailable } from './live-tile';
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
  const playing = data?.state === 'playing';

  return (
    <LiveTile
      label="Spotify"
      icon={<BrandIcon icon="siSpotify" name="Spotify" className="size-3.5" />}
      aside={
        playing ? (
          <span className="flex items-center gap-2 text-teal">
            <Equalizer />
            Now playing
          </span>
        ) : data?.state === 'recent' ? (
          'Last played'
        ) : null
      }
      backdrop={track?.art ? <Ambient art={track.art} playing={playing} /> : null}
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
            <div className="relative size-20 shrink-0 sm:size-24">
              <TiltedCard
                imageSrc={track.art}
                altText={track.album ? `${track.album} cover` : ''}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={12}
                scaleOnHover={1.06}
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {track.url ? (
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer"
                className="truncate font-display text-xl leading-tight font-semibold underline-offset-4 hover:text-teal hover:underline focus-visible:text-teal"
              >
                <Scramble text={track.title} />
              </a>
            ) : (
              <Scramble
                text={track.title}
                className="truncate font-display text-xl leading-tight font-semibold"
              />
            )}
            <p className="truncate text-muted-foreground">{track.artists.join(', ')}</p>
            {track.album ? (
              <p className="truncate font-mono text-[0.7rem] text-muted-foreground/70">
                {track.album}
              </p>
            ) : null}
            {data.state === 'playing' && data.progressMs !== null && track.durationMs ? (
              <Progress
                progressMs={data.progressMs}
                durationMs={track.durationMs}
                since={receivedAt}
              />
            ) : data.state === 'recent' && data.playedAt ? (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {shortDuration((receivedAt - Date.parse(data.playedAt)) / 1000)} ago
              </p>
            ) : null}
          </div>
        </div>
      )}
    </LiveTile>
  );
}

/** The cover, blown up and blurred, drifting slowly behind the tile while a track plays. */
function Ambient({ art, playing }: { art: string; playing: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!playing) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(ref.current, { rotate: 360, duration: 60, ease: 'none', repeat: -1 });
        gsap.to(ref.current, {
          scale: 1.9,
          duration: 9,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { dependencies: [playing, art], revertOnUpdate: true }
  );

  return (
    <>
      <div
        ref={ref}
        className="absolute inset-[-40%] scale-150 bg-cover bg-center opacity-35 blur-3xl saturate-150"
        style={{ backgroundImage: `url("${art}")` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/70 to-surface/20" />
    </>
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
  const now = useNow(since);
  const elapsed = Math.min(durationMs, progressMs + (now - since));
  return (
    <div className="mt-2 flex items-center gap-3 font-mono text-[0.7rem] text-muted-foreground tabular-nums">
      <span>{clock(elapsed)}</span>
      <span
        role="progressbar"
        aria-label="Track progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs / 1000)}
        aria-valuenow={Math.round(elapsed / 1000)}
        className="relative h-1 flex-1 rounded-full bg-surface-2"
      >
        <span
          className={cn(
            'absolute inset-0 origin-left rounded-full bg-linear-to-r from-teal/60 to-teal shadow-[0_0_10px_var(--teal)]',
            'transition-transform duration-1000 ease-linear motion-reduce:transition-none'
          )}
          style={{ transform: `scaleX(${elapsed / durationMs})` }}
        />
      </span>
      <span>{clock(durationMs)}</span>
    </div>
  );
}
