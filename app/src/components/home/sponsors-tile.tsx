import Image from 'next/image';
import { ArrowUpRight, Heart } from 'lucide-react';

import type { PixelCardProps } from '@/components/rb/PixelCard';
import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

import { SponsorCard } from './sponsor-card';

// Green ramp from the design tokens (#66ff99 family); pixels light up under the pointer on hover.
const PIXELS = {
  colors: ['#c6f6df', '#6fd8a6', '#2f9e69'],
  glowColor: '#3fbf82',
  gap: 5,
  speed: 30,
  shape: 'circle',
  origin: 'pointer',
  radius: 12,
  noFocus: true,
  className: 'w-full border border-line',
} satisfies PixelCardProps;

/** Financial sponsors as a margin tile, with the GitHub Sponsors link under them. */
export function SponsorsTile() {
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid gap-2 @md:grid-cols-2">
        {sponsors.map(s => {
          const body = (
            <>
              <Image
                src={encodeURI(s.logo)}
                alt=""
                width={36}
                height={36}
                className="size-9 rounded-full border border-line-strong object-cover"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate font-ui font-semibold">{s.name}</span>
                <span className="truncate font-mono text-xs text-muted-foreground">{s.handle}</span>
              </span>
            </>
          );
          const row = 'flex items-center gap-3 px-4 py-3';
          return (
            <li key={s.handle}>
              <SponsorCard {...PIXELS}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${row} focus-visible:outline-none`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={row}>{body}</div>
                )}
              </SponsorCard>
            </li>
          );
        })}
      </ul>
      <a
        href={profile.githubSponsors}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex w-fit items-center gap-2 font-ui text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <Heart
          aria-hidden
          className="size-3 fill-current text-teal transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
        />
        Sponsor me on GitHub
        <ArrowUpRight
          aria-hidden
          className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal"
        />
      </a>
    </div>
  );
}
