'use client';

import { useRef } from 'react';

import { useActive } from '@/hooks/use-active';
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
 * The first poll starts once the hero has settled; after that it polls only while the panel is
 * within a screen of the viewport. Clocks and loops inside the tiles run only while it is on
 * screen. A failed poll keeps the last good data; with no data at all the tiles read unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterIntro();
  const ref = useRef<HTMLDivElement>(null);
  const near = useActive(ref, '100% 0px');
  const active = useActive(ref);
  const { data, isPending, isError, dataUpdatedAt } = useLive(started, near);
  const loading = isPending && !isError;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-tile]', {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
          clearProps: 'transform',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
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
        active={active}
        className="md:col-span-4"
      />
      <DiscordTile
        data={data?.discord}
        loading={loading}
        active={active}
        className="md:col-span-2"
      />
      <MachineTile
        data={data?.pc}
        loading={loading}
        receivedAt={dataUpdatedAt}
        active={active}
        className="md:col-span-2"
      />
      <ZedTile
        pc={data?.pc}
        loading={loading}
        receivedAt={dataUpdatedAt}
        active={active}
        className="md:col-span-4"
      />
    </div>
  );
}
