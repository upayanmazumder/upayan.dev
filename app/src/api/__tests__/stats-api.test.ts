import { describe, expect, it, vi } from 'vitest';
import * as z from 'zod';

import { createStatsApi, statsUrl } from '../stats-api';

const schema = z.object({ value: z.number() });
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('statsUrl', () => {
  it('keeps a path prefix in the base URL', () => {
    expect(statsUrl('https://host/v1/', '/api/stats').href).toBe('https://host/v1/api/stats');
  });

  it('adds only defined, non-empty params', () => {
    const url = statsUrl('https://host', 'devjourney', {
      path: 'a b/c.md',
      empty: '',
      none: undefined,
    });
    expect(url.href).toBe('https://host/devjourney?path=a+b%2Fc.md');
  });
});

describe('createStatsApi', () => {
  it('reports missing configuration without calling fetch', async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const result = await createStatsApi(undefined, fetchImpl).get('/x', {
      schema,
      cache: 'no-store',
    });
    expect(result).toEqual({ ok: false, reason: 'config' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('retries a transient 503 and returns the later success', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({}, 503))
      .mockResolvedValueOnce(json({ value: 7 }));
    const result = await createStatsApi('https://host', fetchImpl).get('/x', {
      schema,
      cache: 'no-store',
    });
    expect(result).toEqual({ ok: true, data: { value: 7 }, status: 200 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('does not retry a 404', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json({}, 404));
    const result = await createStatsApi('https://host', fetchImpl).get('/x', {
      schema,
      cache: 'no-store',
      retries: 2,
    });
    expect(result).toEqual({ ok: false, reason: 'status', status: 404 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('gives up after the retry budget on network errors', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('fetch failed'));
    const result = await createStatsApi('https://host', fetchImpl).get('/x', {
      schema,
      cache: 'no-store',
      retries: 1,
    });
    expect(result).toEqual({ ok: false, reason: 'network' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('accepts a listed error status when its body is usable', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json({ value: 1 }, 502));
    const result = await createStatsApi('https://host', fetchImpl).get('/x', {
      schema,
      cache: 'no-store',
      acceptStatus: status => status === 502,
    });
    expect(result).toEqual({ ok: true, data: { value: 1 }, status: 502 });
  });

  it('rejects an unexpected body shape without retrying', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(json({ value: 'nope' }));
    const result = await createStatsApi('https://host', fetchImpl).get('/x', {
      schema,
      cache: { revalidate: 60 },
    });
    expect(result).toEqual({ ok: false, reason: 'shape' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
