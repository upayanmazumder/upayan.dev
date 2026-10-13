'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/api';
import BorderGlow from '@/components/rb/BorderGlow';
import { cn } from '@/lib/utils';

import { useReducedMotion } from '../use-reduced-motion';
import { DiscordRow } from './discord-row';
import { shortDuration } from './format';
import { MachineRow } from './machine-row';
import { SpotifyRow } from './spotify-row';
import type { LiveResponse } from './types';
import { useAfterIntro } from './use-after-intro';
import { ZedRow } from './zed-row';

const POLL_MS = 30_000;

/**
 * Compact live panel. Polls the same-origin `/api/live` proxy once the hero has settled.
 * A teal glow then sweeps the border while the rows fade in one by one, and the edge glow
 * follows the pointer. A failed request marks every row unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterIntro();
  const reduced = useReducedMotion();
  const { data, isPending, isError, dataUpdatedAt } = useQuery({
    queryKey: ['live'],
    queryFn: async () => (await api.get<LiveResponse>('/live')).data,
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
    enabled: started,
  });

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
        <PanelHeader pending={isPending} failed={isError} updatedAt={dataUpdatedAt} />
        <ul className="divide-y divide-line border-t border-line">
          <SpotifyRow
            data={data?.spotify}
            loading={isPending}
            receivedAt={dataUpdatedAt}
            index={0}
          />
          <ZedRow pc={data?.pc} loading={isPending} receivedAt={dataUpdatedAt} index={1} />
          <DiscordRow data={data?.discord} loading={isPending} index={2} />
          <MachineRow data={data?.pc} loading={isPending} index={3} />
        </ul>
      </div>
    </BorderGlow>
  );
}

function PanelHeader({
  pending,
  failed,
  updatedAt,
}: {
  pending: boolean;
  failed: boolean;
  updatedAt: number;
}) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
      <span className="flex items-center gap-2">
        <span aria-hidden className="relative flex size-1.5">
          {!pending && !failed ? (
            <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-70 motion-reduce:animate-none" />
          ) : null}
          <span
            className={cn(
              'relative size-1.5 rounded-full',
              failed ? 'bg-destructive' : pending ? 'bg-muted-foreground/50' : 'bg-teal'
            )}
          />
        </span>
        <span className={cn(!pending && !failed && 'text-teal')}>
          {failed ? 'Offline' : pending ? 'Connecting' : 'Live'}
        </span>
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
    <span className="tracking-normal normal-case tabular-nums">
      synced {shortDuration((now - at) / 1000)} ago
    </span>
  );
}
