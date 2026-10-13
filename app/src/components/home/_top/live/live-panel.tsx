'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api';
import { cn } from '@/lib/utils';

import { DiscordRow } from './discord-row';
import { MachineRow } from './machine-row';
import { SpotifyRow } from './spotify-row';
import type { LiveResponse } from './types';
import { useAfterIntro } from './use-after-intro';
import { ZedRow } from './zed-row';

const POLL_MS = 30_000;

/**
 * Compact live panel. Polls the same-origin `/api/live` proxy once the hero has settled,
 * then the rows fade in one by one. A failed request marks every row unavailable.
 */
export function LivePanel({ className }: { className?: string }) {
  const started = useAfterIntro();
  const { data, isPending, dataUpdatedAt } = useQuery({
    queryKey: ['live'],
    queryFn: async () => (await api.get<LiveResponse>('/live')).data,
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
    enabled: started,
  });

  return (
    <ul
      data-shown={started}
      className={cn(
        'divide-y divide-line rounded-xl border border-line bg-surface/60 backdrop-blur-sm',
        className
      )}
    >
      <SpotifyRow data={data?.spotify} loading={isPending} receivedAt={dataUpdatedAt} index={0} />
      <ZedRow pc={data?.pc} loading={isPending} receivedAt={dataUpdatedAt} index={1} />
      <DiscordRow data={data?.discord} loading={isPending} index={2} />
      <MachineRow data={data?.pc} loading={isPending} index={3} />
    </ul>
  );
}
