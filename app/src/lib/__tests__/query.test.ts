import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { QUERY_STALE_TIME_MS } from '@/constants';

import { getQueryClient, makeQueryClient } from '../query';

describe('makeQueryClient', () => {
  it('returns a QueryClient', () => {
    expect(makeQueryClient()).toBeInstanceOf(QueryClient);
  });

  it('sets staleTime to QUERY_STALE_TIME_MS', () => {
    const client = makeQueryClient();
    expect(client.getDefaultOptions().queries?.staleTime).toBe(QUERY_STALE_TIME_MS);
  });

  it('sets mutation retry to 0', () => {
    const client = makeQueryClient();
    expect(client.getDefaultOptions().mutations?.retry).toBe(0);
  });
});

describe('getQueryClient', () => {
  it('returns the same instance on repeated calls (browser singleton)', () => {
    const a = getQueryClient();
    const b = getQueryClient();
    expect(a).toBe(b);
  });

  it('returns a QueryClient', () => {
    expect(getQueryClient()).toBeInstanceOf(QueryClient);
  });
});
