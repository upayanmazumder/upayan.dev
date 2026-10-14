'use client';

import { useQuery } from '@tanstack/react-query';

import { api, isApiError } from '@/api';

import type { LiveResponse } from './types';

const POLL_MS = 30_000;

/**
 * Polls the same-origin `/api/live` proxy while the tab is visible.
 * Transient failures retry with backoff and keep the last good data on screen.
 * A missing server configuration never retries.
 */
export function useLive(enabled: boolean) {
  return useQuery({
    queryKey: ['live'],
    queryFn: async ({ signal }) => (await api.get<LiveResponse>('/live', { signal })).data,
    enabled,
    staleTime: POLL_MS,
    refetchInterval: query =>
      isApiError(query.state.error) && query.state.error.code === 'NOT_CONFIGURED'
        ? false
        : POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: (failures, error) =>
      !(isApiError(error) && error.code === 'NOT_CONFIGURED') && failures < 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
  });
}
