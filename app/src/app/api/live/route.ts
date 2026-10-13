import { NextResponse } from 'next/server';

import { statsSchema, toLiveResponse } from '@/components/home/_top/live/parse';
import type { LiveResponse } from '@/components/home/_top/live/types';
import { env } from '@/env';

export const dynamic = 'force-dynamic';

const TIMEOUT_MS = 8000;
const NO_STORE = { 'Cache-Control': 'no-store' };

type ErrorBody = { error: string };

/** Proxies the Rust stats API so the browser never talks to it directly. */
export async function GET(): Promise<NextResponse<LiveResponse | ErrorBody>> {
  if (!env.API_URL) {
    return NextResponse.json(
      { error: 'Live stats are not configured' },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    const response = await fetch(new URL('/api/stats', env.API_URL), {
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json' },
    });
    // Upstream answers 502 with per-provider nulls when everything failed; that body is still usable.
    const parsed = statsSchema.safeParse(await response.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Live stats returned an unexpected shape' },
        { status: 502, headers: NO_STORE }
      );
    }
    return NextResponse.json(toLiveResponse(parsed.data), { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: 'Live stats are unreachable' },
      { status: 502, headers: NO_STORE }
    );
  }
}
