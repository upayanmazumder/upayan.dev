'use client';

import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { DiscordTile } from './discord-tile';
import { MachineTile } from './machine-tile';
import { SpotifyTile } from './spotify-tile';
import { useAfterIntro } from './use-after-intro';
import { useLive } from './use-live';
import { ZedTile } from './zed-tile';

/**
 * Bento of live tiles: Spotify and Discord on top, the machine and the Zed editor below.
 * Polling starts once the hero has settled. When the section scrolls in, the tiles rise and
 * unfold in 3D one after another (GSAP). Every tile's border glows toward the pointer.
 * A failed poll keeps the last good data; with no data at all the tiles read unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterIntro();
  const ref = useRef<HTMLDivElement>(null);
  const { data, isPending, isError, dataUpdatedAt } = useLive(started);
  const loading = isPending && !isError;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-tile]', {
          autoAlpha: 0,
          y: 40,
          rotateX: -12,
          scale: 0.97,
          filter: 'blur(8px)',
          transformPerspective: 900,
          transformOrigin: '50% 100%',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.1,
          clearProps: 'filter,transform',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('grid grid-cols-1 gap-3 md:grid-cols-6', className)}>
      <SpotifyTile
        data={data?.spotify}
        loading={loading}
        receivedAt={dataUpdatedAt}
        className="md:col-span-4"
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
        className="md:col-span-4"
      />
    </div>
  );
}
