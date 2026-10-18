'use client';

import { useRef } from 'react';

import { MarginAside } from '@/components/shell/margin-aside';
import { useActive } from '@/hooks/use-active';

import { DiscordTile } from './discord-tile';
import { MachineTile } from './machine-tile';
import { SpotifyTile } from './spotify-tile';
import { useAfterIntro } from './use-after-intro';
import { useLive } from './use-live';
import { ZedTile } from './zed-tile';

export type LiveTileName = 'spotify' | 'discord' | 'machine' | 'zed';

interface LiveAsideProps {
  tile: LiveTileName;
  side: 'left' | 'right';
}

/**
 * One live tile parked in a page margin. Every tile shares the `/api/live` query, so four asides
 * still cost one poll. The first poll waits for the hero intro; after that a tile polls only while
 * it is within a screen of the viewport, and its clocks and loops run only while it is on screen.
 */
export function LiveAside({ tile, side }: LiveAsideProps) {
  const started = useAfterIntro();
  const ref = useRef<HTMLDivElement>(null);
  const near = useActive(ref, '100% 0px');
  const active = useActive(ref);
  const { data, isPending, isError, dataUpdatedAt } = useLive(started, near);
  const loading = isPending && !isError;

  return (
    <MarginAside side={side}>
      <div ref={ref}>
        {tile === 'spotify' ? (
          <SpotifyTile
            data={data?.spotify}
            loading={loading}
            receivedAt={dataUpdatedAt}
            active={active}
          />
        ) : null}
        {tile === 'discord' ? (
          <DiscordTile data={data?.discord} loading={loading} active={active} />
        ) : null}
        {tile === 'machine' ? (
          <MachineTile
            data={data?.pc}
            loading={loading}
            receivedAt={dataUpdatedAt}
            active={active}
          />
        ) : null}
        {tile === 'zed' ? (
          <ZedTile pc={data?.pc} loading={loading} receivedAt={dataUpdatedAt} active={active} />
        ) : null}
      </div>
    </MarginAside>
  );
}
