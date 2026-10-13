'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/api';

import { DiscordCard } from './discord-card';
import { MachineCard } from './machine-card';
import { SpotifyCard } from './spotify-card';
import type { LiveResponse } from './types';

const POLL_MS = 30_000;

/** Polls the same-origin `/api/live` proxy. A failed request marks every card unavailable. */
export function LiveCards() {
  const { data, isPending, dataUpdatedAt } = useQuery({
    queryKey: ['live'],
    queryFn: async () => (await api.get<LiveResponse>('/live')).data,
    refetchInterval: POLL_MS,
    staleTime: POLL_MS,
  });

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <SpotifyCard
        data={data?.spotify}
        loading={isPending}
        receivedAt={dataUpdatedAt}
        className="md:col-span-2"
      />
      <DiscordCard data={data?.discord} loading={isPending} />
      <MachineCard data={data?.pc} loading={isPending} />
    </div>
  );
}
