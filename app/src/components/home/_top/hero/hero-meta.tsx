'use client';

import { ArrowUpRight, Copy, MapPin } from 'lucide-react';

import { profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';

const action =
  'inline-flex min-h-10 items-center gap-1.5 transition-colors hover:text-teal focus-visible:text-teal';

/** Location with live IST clock, copy-email and resume actions. */
export function HeroMeta() {
  const time = useLocalTime();
  const copyEmail = useCopyEmail();

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
      <span className="inline-flex min-h-10 items-center gap-1.5">
        <MapPin aria-hidden className="size-3.5" />
        {profile.location}
        <span className="text-foreground tabular-nums" suppressHydrationWarning>
          {time ? `${time} IST` : 'IST'}
        </span>
      </span>
      <button
        type="button"
        onClick={copyEmail}
        className={action}
        aria-label={`Copy email ${profile.email}`}
      >
        <Copy aria-hidden className="size-3.5" />
        {profile.email}
      </button>
      <a href={profile.resume} target="_blank" rel="noreferrer" className={action}>
        Resume
        <ArrowUpRight aria-hidden className="size-3.5" />
      </a>
    </div>
  );
}
