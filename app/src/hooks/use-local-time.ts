'use client';

import { useEffect, useState } from 'react';

import { profile } from '@/data/profile';

const formatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: profile.timeZone,
});

/** Upayan's local time as "hh:mm" (IST), updated every 15 s. Empty string before mount to avoid hydration mismatch. */
export function useLocalTime(): string {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}
