import { queryOptions } from '@tanstack/react-query';

import { api } from '@/api';

import type { LiveResponse } from './types';

export const LIVE_POLL_MS = 10_000;

/** The `/api/live` snapshot. The preloader fetches it first, and the live tiles poll it after the reveal. */
export const liveQuery = queryOptions({
  queryKey: ['live'],
  queryFn: async ({ signal }) => (await api.get<LiveResponse>('/live', { signal })).data,
  staleTime: LIVE_POLL_MS,
});
