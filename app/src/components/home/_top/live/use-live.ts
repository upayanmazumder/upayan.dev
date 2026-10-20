'use client';

import { useQuery } from '@tanstack/react-query';

import { isApiError } from '@/api';

import { LIVE_POLL_MS, liveQuery } from './live-query';

/**
 * Polls the same-origin `/api/live` proxy. Once `started`, the first fetch always runs; after
 * that it polls only while `near` (panel close to the viewport and tab visible) and catches up as
 * soon as it comes back. Transient failures retry with backoff and keep the last good data on
 * screen. A missing server configuration never retries.
 */
export function useLive(started: boolean, near: boolean) {
  return useQuery({
    ...liveQuery,
    enabled: query => started && (near || query.state.data === undefined),
    refetchInterval: query =>
      isApiError(query.state.error) && query.state.error.code === 'NOT_CONFIGURED'
        ? false
        : LIVE_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: (failures, error) =>
      !(isApiError(error) && error.code === 'NOT_CONFIGURED') && failures < 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
  });
}
