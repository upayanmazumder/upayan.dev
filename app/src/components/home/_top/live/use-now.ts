'use client';

import { useEffect, useState } from 'react';

/** Epoch ms, refreshed every `intervalMs`. Starts at `since` so server and first client render agree. */
export function useNow(since: number, intervalMs = 1000): number {
  const [now, setNow] = useState(since);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [since, intervalMs]);

  return Math.max(now, since);
}
