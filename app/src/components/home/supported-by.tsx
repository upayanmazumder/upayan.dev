import Image from 'next/image';
import { ArrowUpRight, Heart } from 'lucide-react';

import type { PixelCardProps } from '@/components/rb/PixelCard';
import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

import { SponsorCard } from './sponsor-card';

// Teal ramp from the design tokens; pixels light up under the pointer on hover.
const PIXELS = {
  colors: ['#c6f6e6', '#6fd8bd', '#2f9e86'],
  glowColor: '#3fbfa0',
  gap: 5,
  speed: 30,
  shape: 'circle',
  origin: 'pointer',
  radius: 12,
  noFocus: true,
  className: 'w-full border border-line',
} satisfies PixelCardProps;

/** Section highlighting financial sponsors with interactive cards and GitHub sponsorship link. */
export function SupportedBy() {
  return (
    <Section id="supported-by" index="03" title="Supported by">
      <Reveal className="flex flex-col gap-4">
        <ul data-reveal className="grid gap-3 sm:grid-cols-2">
          {sponsors.map(s => {
            const body = (
              <>
                <Image
                  src={encodeURI(s.logo)}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full border border-line-strong object-cover"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-ui font-semibold">{s.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {s.handle}
                  </span>
                </span>
              </>
            );
            const row = 'flex items-center gap-3 px-4 py-3.5';
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
          data-reveal
          href={profile.githubSponsors}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex w-fit items-center gap-2 font-ui text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
        >
          <Heart
            aria-hidden
            className="size-3.5 fill-current text-teal transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
          />
          Sponsor me on GitHub
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal"
          />
        </a>
      </Reveal>
    </Section>
  );
}
