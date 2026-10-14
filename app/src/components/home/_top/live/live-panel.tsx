'use client';

import { useEffect, useState } from 'react';

import BorderGlow from '@/components/rb/BorderGlow';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../use-reduced-motion';
import { DiscordRow } from './discord-row';
import { shortDuration } from './format';
import { MachineRow } from './machine-row';
import { SpotifyRow } from './spotify-row';
import { useAfterIntro } from './use-after-intro';
import { useLive } from './use-live';
import { ZedRow } from './zed-row';

type PanelState = 'connecting' | 'live' | 'reconnecting' | 'offline';

const STATE_LABEL: Record<PanelState, string> = {
  connecting: 'Connecting',
  live: 'Live',
  reconnecting: 'Reconnecting',
  offline: 'Offline',
};

/**
 * Compact live panel. Polls once the hero has settled. A teal glow then sweeps the border
 * while the rows fade in one by one, and the edge glow follows the pointer. A failed poll
 * keeps the last good data and shows "Reconnecting"; with no data at all the rows read
 * unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterIntro();
  const reduced = useReducedMotion();
  const { data, isPending, isError, dataUpdatedAt } = useLive(started);
  const loading = isPending && !isError;
  const state: PanelState = !data
    ? isError
      ? 'offline'
      : 'connecting'
    : isError
      ? 'reconnecting'
      : 'live';

  return (
    <BorderGlow
      animated={started && !reduced}
      backgroundColor="var(--surface)"
      borderRadius={14}
      glowColor="165 55 55"
      colors={['#6fd8bd', '#3fbfa0', '#c6f6e6']}
      glowRadius={28}
      glowIntensity={0.7}
      edgeSensitivity={25}
      fillOpacity={0.3}
      className={cn('w-full', className)}
    >
      <div data-shown={started}>
        <PanelHeader state={state} updatedAt={dataUpdatedAt} />
        <ul className="divide-y divide-line border-t border-line">
          <SpotifyRow data={data?.spotify} loading={loading} receivedAt={dataUpdatedAt} index={0} />
          <ZedRow pc={data?.pc} loading={loading} receivedAt={dataUpdatedAt} index={1} />
          <DiscordRow data={data?.discord} loading={loading} index={2} />
          <MachineRow data={data?.pc} loading={loading} index={3} />
        </ul>
      </div>
    </BorderGlow>
  );
}

function PanelHeader({ state, updatedAt }: { state: PanelState; updatedAt: number }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
      <span role="status" className="flex items-center gap-2">
        <span aria-hidden className="relative flex size-1.5">
          {state === 'live' || state === 'reconnecting' ? (
            <span
              className={cn(
                'absolute inset-0 animate-ping rounded-full opacity-70 motion-reduce:animate-none',
                state === 'live' ? 'bg-teal' : 'bg-amber-400'
              )}
            />
          ) : null}
          <span
            className={cn(
              'relative size-1.5 rounded-full',
              state === 'live' && 'bg-teal',
              state === 'reconnecting' && 'bg-amber-400',
              state === 'offline' && 'bg-destructive',
              state === 'connecting' && 'bg-muted-foreground/50'
            )}
          />
        </span>
        <span className={cn(state === 'live' && 'text-teal')}>{STATE_LABEL[state]}</span>
      </span>
      {updatedAt ? <Synced at={updatedAt} /> : null}
    </div>
  );
}

function Synced({ at }: { at: number }) {
  const [now, setNow] = useState(at);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [at]);

  return (
    <span className="truncate tracking-normal normal-case tabular-nums">
      synced {shortDuration((now - at) / 1000)} ago
    </span>
  );
}
