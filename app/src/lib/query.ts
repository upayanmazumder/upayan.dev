import { isServer, QueryClient } from '@tanstack/react-query';

import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from '@/constants';

let browserQueryClient: QueryClient | undefined;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        gcTime: QUERY_GC_TIME_MS,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

// Typed query key factory. Usage: const userKeys = createQueryKeys('users')
export function createQueryKeys<K extends string>(entity: K) {
  return {
    all: () => [entity] as const,
    lists: () => [entity, 'list'] as const,
    list: <F extends Record<string, unknown>>(filters?: F) => [entity, 'list', filters] as const,
    detail: (id: string | number) => [entity, id] as const,
  };
}
