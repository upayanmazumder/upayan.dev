'use client';

import { m } from 'motion/react';

import TiltedCard from '@/components/rb/TiltedCard';
import { BrandIcon } from '@/components/ui/brand-icon';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../use-reduced-motion';
import { shortDuration } from './format';
import { LiveTile, Scramble, TileSkeleton, TileUnavailable } from './live-tile';
import type { LiveSpotify } from './types';
import { useNow } from './use-now';

interface SpotifyTileProps {
  data: LiveSpotify | null | undefined;
  loading: boolean;
  /** Epoch ms when `data` arrived; progress ticks forward from here between polls. */
  receivedAt: number;
  /** Panel on screen and tab visible; loops and the progress clock run only then. */
  active: boolean;
  className?: string;
}

export function SpotifyTile({ data, loading, receivedAt, active, className }: SpotifyTileProps) {
  const track = data && data.state !== 'idle' ? data.track : null;
  const playing = data?.state === 'playing';

  return (
    <LiveTile
      label="Spotify"
      icon={<BrandIcon icon="siSpotify" name="Spotify" className="size-3.5" />}
      aside={
        playing ? (
          <span className="flex items-center gap-2 text-teal">
            <Equalizer active={active} />
            Now playing
          </span>
        ) : data?.state === 'recent' ? (
          'Last played'
        ) : null
      }
      backdrop={track?.art ? <Ambient art={track.art} spin={playing && active} /> : null}
      className={className}
    >
      {loading ? (
        <TileSkeleton lines={3} />
      ) : !data ? (
        <TileUnavailable what="Spotify" />
      ) : !track ? (
        <p className="text-sm text-muted-foreground">Nothing playing right now.</p>
      ) : (
        <div className="flex items-center gap-3 @xl:gap-4">
          {track.art ? (
            <div className="relative size-16 shrink-0 @xl:size-24">
              <TiltedCard
                imageSrc={track.art}
                altText={track.album ? `${track.album} cover` : ''}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={6}
                scaleOnHover={1.03}
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
                className="truncate font-display text-base leading-tight font-semibold underline-offset-4 hover:text-teal hover:underline focus-visible:text-teal @xl:text-xl"
              >
                <Scramble text={track.title} />
              </a>
            ) : (
              <Scramble
                text={track.title}
                className="truncate font-display text-base leading-tight font-semibold @xl:text-xl"
              />
            )}
            <p className="truncate text-sm text-muted-foreground @xl:text-base">
              {track.artists.join(', ')}
            </p>
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
                active={active}
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

/**
 * The cover, blown up and blurred, turning slowly behind the tile while a track plays. A CSS spin on
 * its own layer: the blur rasterises once and the compositor rotates it, paused while inactive.
 */
function Ambient({ art, spin }: { art: string; spin: boolean }) {
  return (
    <>
      <div
        data-spin={spin}
        className="absolute inset-[-40%] scale-150 animate-spin bg-cover bg-center opacity-30 blur-2xl saturate-125 will-change-transform [animation-duration:90s] data-[spin=false]:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ backgroundImage: `url("${art}")` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-surface via-surface/70 to-surface/20" />
    </>
  );
}

const BARS = [0.55, 1, 0.7, 0.85];

/** Bouncing bars beside "Now playing". Static bars while the panel is inactive or motion is reduced. */
function Equalizer({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const live = active && !reduced;
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {BARS.map((peak, i) => (
        <m.span
          key={i}
          className="h-full w-[2px] origin-bottom rounded-full bg-teal"
          initial={{ scaleY: 0.3 }}
          animate={live ? { scaleY: [0.3, peak, 0.45, peak * 0.8, 0.3] } : { scaleY: peak * 0.6 }}
          transition={
            live
              ? { duration: 1.4 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
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
  active,
}: {
  progressMs: number;
  durationMs: number;
  since: number;
  active: boolean;
}) {
  const now = useNow(since, 1000, active);
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
