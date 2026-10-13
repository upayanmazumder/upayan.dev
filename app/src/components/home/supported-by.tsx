import Image from 'next/image';
import { ArrowUpRight, Heart } from 'lucide-react';

import PixelCard, { type PixelCardProps } from '@/components/rb/PixelCard';
import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

// Teal ramp from the design tokens; pixels light up under the pointer on hover.
const PIXELS = {
  colors: ['#c6f6e6', '#6fd8bd', '#2f9e86'],
  glowColor: '#3fbfa0',
  gap: 6,
  speed: 30,
  shape: 'circle',
  origin: 'pointer',
  radius: 14,
  noFocus: true,
  className: 'h-44 w-full border border-line',
} satisfies PixelCardProps;

export function SupportedBy() {
  return (
    <Section id="supported-by" index="10" title="Supported by">
      <Reveal className="grid gap-4 sm:grid-cols-2">
        {sponsors.map(s => {
          const body = (
            <>
              <span className="label">Sponsor</span>
              <span className="flex items-center gap-4">
                <Image
                  src={encodeURI(s.logo)}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-line-strong object-cover ring-4 ring-background/60"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-ui text-lg font-semibold">{s.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {s.handle}
                  </span>
                </span>
              </span>
            </>
          );
          return (
            <div key={s.handle} data-reveal>
              <PixelCard {...PIXELS}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col justify-between p-5 focus-visible:outline-none"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex h-full flex-col justify-between p-5">{body}</div>
                )}
              </PixelCard>
            </div>
          );
        })}
        <div data-reveal>
          <PixelCard {...PIXELS} className={`${PIXELS.className} border-dashed`}>
            <a
              href={profile.githubSponsors}
              target="_blank"
              rel="noreferrer"
              className="group/sponsor flex h-full flex-col justify-between p-5 focus-visible:outline-none"
            >
              <span className="flex items-center justify-between">
                <span className="label">Your name here</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 text-muted-foreground transition-transform duration-300 group-hover/sponsor:translate-x-0.5 group-hover/sponsor:-translate-y-0.5 group-hover/sponsor:text-teal group-focus-visible/sponsor:text-teal"
                />
              </span>
              <span className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full border border-teal/30 bg-teal-dim text-teal">
                  <Heart aria-hidden className="size-6 fill-current" />
                </span>
                <span className="flex flex-col">
                  <span className="font-ui text-lg font-semibold">Become a sponsor</span>
                  <span className="text-xs text-muted-foreground">Through GitHub Sponsors</span>
                </span>
              </span>
            </a>
          </PixelCard>
        </div>
      </Reveal>
    </Section>
  );
}
