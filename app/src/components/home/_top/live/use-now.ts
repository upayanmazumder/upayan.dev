'use client';

import { useEffect, useState } from 'react';

/**
 * Epoch ms, refreshed every `intervalMs` while `enabled`. Starts at `since` so server and first client
 * render agree. Pass `enabled = false` when the consumer is offscreen or the tab is hidden.
 */
export function useNow(since: number, intervalMs = 1000, enabled = true): number {
  const [now, setNow] = useState(since);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => setNow(Date.now());
    // Catch up at once after resuming, without a synchronous setState in the effect body.
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [since, intervalMs, enabled]);

  return Math.max(now, since);
}
