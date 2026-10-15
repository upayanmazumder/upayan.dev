import { NextResponse } from 'next/server';

import { statsApi } from '@/api/stats';
import { statsSchema, toLiveResponse } from '@/components/home/_top/live/parse';
import type { LiveResponse } from '@/components/home/_top/live/types';

export const dynamic = 'force-dynamic';

// A short shared cache: many visitors polling at once cause one upstream call per 5 s.
const LIVE_CACHE = 'public, max-age=0, s-maxage=5, stale-while-revalidate=10';
const NO_STORE = 'no-store';

/** Error body in the shape `toApiError` reads: `message` for people, `code` for retry decisions. */
interface ErrorBody {
  message: string;
  code: 'NOT_CONFIGURED' | 'UPSTREAM_UNREACHABLE' | 'UPSTREAM_STATUS' | 'UPSTREAM_SHAPE';
}

const fail = (status: number, body: ErrorBody) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': NO_STORE } });

/** Proxies the Rust stats API so the browser never talks to it directly. */
export async function GET(): Promise<NextResponse<LiveResponse | ErrorBody>> {
  const result = await statsApi.get('/api/stats', {
    schema: statsSchema,
    cache: 'no-store',
    // Upstream answers 502 with per-provider nulls when every provider failed; that body is usable.
    acceptStatus: status => status === 502,
  });

  if (result.ok) {
    return NextResponse.json(toLiveResponse(result.data), {
      headers: { 'Cache-Control': LIVE_CACHE },
    });
  }
  switch (result.reason) {
    case 'config':
      return fail(503, { message: 'Live stats are not configured', code: 'NOT_CONFIGURED' });
    case 'shape':
      return fail(502, {
        message: 'Live stats returned an unexpected shape',
        code: 'UPSTREAM_SHAPE',
      });
    case 'status':
      return fail(502, {
        message: `Live stats answered ${result.status}`,
        code: 'UPSTREAM_STATUS',
      });
    default:
      return fail(504, { message: 'Live stats are unreachable', code: 'UPSTREAM_UNREACHABLE' });
  }
}
