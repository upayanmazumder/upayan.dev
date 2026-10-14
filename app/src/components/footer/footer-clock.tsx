'use client';

import { useLocalTime } from '@/hooks/use-local-time';

export function FooterClock() {
  const time = useLocalTime();
  return (
    <span className="font-mono text-xs text-muted-foreground">
      India · IST <time suppressHydrationWarning>{time || '--:--'}</time>
    </span>
  );
}
