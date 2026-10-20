import Image from 'next/image';
import { ArrowUpRight, Heart } from 'lucide-react';

import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

import { LiveTile } from './_top/live/live-tile';

/** People who sponsor the work, in the same tile frame as the live widgets. */
export function SponsorsTile() {
  return (
    <LiveTile label="Sponsors" icon={<Heart aria-hidden className="size-3.5 text-teal" />}>
      <ul className="flex flex-col gap-1">
        {sponsors.map(s => {
          const body = (
            <>
              <Image
                src={encodeURI(s.logo)}
                alt=""
                width={32}
                height={32}
                className="size-8 rounded-full border border-line-strong object-cover"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-ui text-sm font-semibold">{s.name}</span>
                <span className="truncate font-mono text-[0.7rem] text-muted-foreground">
                  {s.handle}
                </span>
              </span>
            </>
          );
          const row = '-mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5';
          return (
            <li key={s.handle}>
              {s.href ? (
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${row} transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none`}
                >
                  {body}
                </a>
              ) : (
                <div className={row}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
      <a
        href={profile.githubSponsors}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-fit items-center gap-1.5 rounded-full border border-teal/30 bg-teal-dim px-3 py-1 font-ui text-xs text-teal transition-colors hover:border-teal/60 focus-visible:border-teal"
      >
        Sponsor me
        <ArrowUpRight
          aria-hidden
          className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </LiveTile>
  );
}
