import type { output as ZodOutput, ZodType } from 'zod';

/** Why a stats API call produced no data. Callers map these to "unavailable" or "missing" states. */
export type StatsFailure =
  | { reason: 'config' }
  | { reason: 'timeout' }
  | { reason: 'network' }
  | { reason: 'status'; status: number }
  | { reason: 'shape' };

export type StatsResult<T> = { ok: true; data: T; status: number } | ({ ok: false } & StatsFailure);

type Cache = { revalidate: number } | 'no-store';

export interface StatsGetOptions<S extends ZodType> {
  schema: S;
  /** Query parameters; `undefined` values are skipped. */
  params?: Record<string, string | undefined>;
  /** ISR seconds for Next's data cache, or `'no-store'` for live data. */
  cache: Cache;
  /** Per-attempt timeout. */
  timeoutMs?: number;
  /** Extra attempts after a network error, timeout, or 502/503/504. */
  retries?: number;
  /** Statuses whose body is still usable, e.g. the combined route's partial 502. */
  acceptStatus?: (status: number) => boolean;
}

const RETRYABLE = new Set([502, 503, 504]);
const DEFAULT_TIMEOUT_MS = 8000;
const BACKOFF_MS = [150, 450];

/**
 * Joins `path` under `base` and keeps any path prefix in the base URL.
 * `new URL('/api/stats', 'https://host/v1')` would drop `/v1`; this does not.
 */
export function statsUrl(base: string, path: string, params?: Record<string, string | undefined>) {
  const url = new URL(base);
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, value);
  }
  return url;
}

function sleep(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, ms);
  return promise;
}

/**
 * Server-side client for the Rust stats API. Every call validates the body with a zod schema,
 * retries transient failures with backoff, and returns a result instead of throwing.
 * Pass `fetchImpl` in tests; Next's patched `fetch` is the default so `cache` maps to ISR.
 */
export function createStatsApi(baseUrl: string | undefined, fetchImpl?: typeof fetch) {
  async function get<S extends ZodType>(
    path: string,
    {
      schema,
      params,
      cache,
      timeoutMs = DEFAULT_TIMEOUT_MS,
      retries = 1,
      acceptStatus,
    }: StatsGetOptions<S>
  ): Promise<StatsResult<ZodOutput<S>>> {
    if (!baseUrl) return { ok: false, reason: 'config' };
    const url = statsUrl(baseUrl, path, params);
    const init: RequestInit & { next?: { revalidate: number } } = {
      headers: { Accept: 'application/json' },
      ...(cache === 'no-store'
        ? { cache: 'no-store' }
        : { next: { revalidate: cache.revalidate } }),
    };

    let failure: StatsFailure = { reason: 'network' };
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(BACKOFF_MS[attempt - 1] ?? BACKOFF_MS.at(-1)!);
      let response: Response;
      try {
        response = await (fetchImpl ?? fetch)(url, {
          ...init,
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (error) {
        failure = {
          reason:
            error instanceof DOMException && error.name === 'TimeoutError' ? 'timeout' : 'network',
        };
        continue;
      }

      if (!response.ok && !acceptStatus?.(response.status)) {
        failure = { reason: 'status', status: response.status };
        if (RETRYABLE.has(response.status)) continue;
        return { ok: false, ...failure };
      }

      const body: unknown = await response.json().catch(() => undefined);
      const parsed = schema.safeParse(body);
      // A wrong shape will not fix itself on retry.
      if (!parsed.success) return { ok: false, reason: 'shape' };
      return { ok: true, data: parsed.data, status: response.status };
    }
    return { ok: false, ...failure };
  }

  return { get };
}
