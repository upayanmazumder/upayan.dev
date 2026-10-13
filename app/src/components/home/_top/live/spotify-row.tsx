'use client';

import Image from 'next/image';
import { m } from 'motion/react';

import { BrandIcon } from '@/components/ui/brand-icon';

import { shortDuration } from './format';
import { LiveRow, Muted } from './live-row';
import type { LiveSpotify } from './types';

interface SpotifyRowProps {
  data: LiveSpotify | null | undefined;
  loading: boolean;
  /** Epoch ms when `data` arrived; "played ago" counts from here. */
  receivedAt: number;
  index: number;
}

export function SpotifyRow({ data, loading, receivedAt, index }: SpotifyRowProps) {
  const track = data && data.state !== 'idle' ? data.track : null;

  return (
    <LiveRow
      label="Spotify"
      index={index}
      loading={loading}
      fill={Boolean(track?.art)}
      icon={
        track?.art ? (
          <Image
            src={track.art}
            alt=""
            width={32}
            height={32}
            unoptimized
            className="size-full object-cover"
          />
        ) : (
          <BrandIcon icon="siSpotify" name="Spotify" />
        )
      }
      meta={
        data?.state === 'playing' ? (
          <Equalizer />
        ) : data?.state === 'recent' && data.playedAt ? (
          shortDuration((receivedAt - Date.parse(data.playedAt)) / 1000)
        ) : null
      }
    >
      {!data ? (
        <Muted>Unavailable</Muted>
      ) : !track ? (
        <Muted>Not playing</Muted>
      ) : (
        <p className="truncate">
          {track.url ? (
            <a
              href={track.url}
              target="_blank"
              rel="noreferrer"
              className="font-ui font-medium underline-offset-4 hover:text-teal hover:underline focus-visible:text-teal"
            >
              {track.title}
            </a>
          ) : (
            <span className="font-ui font-medium">{track.title}</span>
          )}{' '}
          <span className="text-muted-foreground">{track.artists.join(', ')}</span>
        </p>
      )}
    </LiveRow>
  );
}

const BARS = [0.55, 1, 0.7, 0.85];

function Equalizer() {
  return (
    <span aria-label="Now playing" role="img" className="flex h-3 items-end gap-[2px]">
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
