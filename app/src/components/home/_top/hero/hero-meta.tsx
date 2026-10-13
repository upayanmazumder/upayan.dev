'use client';

import { ArrowUpRight, Copy, MapPin } from 'lucide-react';

import { profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';

const chip =
  'inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-ui text-xs text-muted-foreground transition-colors';
const action = `${chip} hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground`;

/** Location with live IST clock, copy-email and resume actions. */
export function HeroMeta() {
  const time = useLocalTime();
  const copyEmail = useCopyEmail();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={chip}>
        <MapPin aria-hidden className="size-3.5" />
        {profile.location}
        <span className="font-mono text-foreground tabular-nums" suppressHydrationWarning>
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
