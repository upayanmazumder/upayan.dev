'use client';

import { useEffect, useState } from 'react';

import { profile } from '@/data/profile';

import { usePageVisible } from './use-active';

const formatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: profile.timeZone,
});

/**
 * Upayan's local time as "hh:mm" (IST). Ticks on each minute boundary while the tab is visible.
 * Empty string before mount to avoid a hydration mismatch.
 */
export function useLocalTime(): string {
  const [time, setTime] = useState('');
  const visible = usePageVisible();

  useEffect(() => {
    if (!visible) return;
    let id: number;
    const tick = () => {
      setTime(formatter.format(new Date()));
      id = window.setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    tick();
    return () => window.clearTimeout(id);
  }, [visible]);

  return time;
}
