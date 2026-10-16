import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials, profile } from '@/data/profile';
import { cn } from '@/lib/utils';

import { Currently } from './_top/hero/currently';
import { Decrypt } from './_top/hero/decrypt';
import { HeroBackdrop } from './_top/hero/hero-backdrop';
import { HeroMeta } from './_top/hero/hero-meta';
import { MagneticLink } from './_top/hero/magnetic-link';
import { PortraitRing } from './_top/hero/portrait-ring';
import { ScrollCue } from './_top/hero/scroll-cue';

/** Characters of one name line, each delayed by its position across the whole name. */
function NameLine({
  text,
  offset,
  className,
}: {
  text: string;
  offset: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn('-mb-[0.1em] block overflow-hidden pb-[0.1em]', className)}>
      {[...text].map((char, i) => (
        <span key={i} className="intro-char" style={{ '--c': offset + i } as CSSProperties}>
          {char}
        </span>
      ))}
    </span>
  );
}

const step = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * Full-height intro inside the rails: photo, name, one sentence, contact, and primary socials.
 * The intro animation is pure CSS on server-rendered markup, so the hero paints with the first
 * HTML instead of waiting for hydration or web fonts.
 */
export function Hero() {
  const [first = '', ...rest] = profile.name.split(' ');
  const last = rest.join(' ');

  return (
    <section id="hero" aria-label="Intro" className="relative isolate flex min-h-svh flex-col">
      <HeroBackdrop />
      <div className="column flex flex-1 flex-col justify-center gap-6 pt-24 pb-28 sm:gap-7 md:pt-28 md:pb-36">
        <div className="flex items-center gap-5">
          <div className="intro-photo relative size-20 shrink-0 overflow-hidden rounded-2xl p-px md:size-24">
            <PortraitRing />
            <span aria-hidden className="absolute inset-0 rounded-2xl border border-line-strong" />
            <Image
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              width={192}
              height={192}
              preload
              className="relative size-full rounded-[calc(var(--radius-2xl)-1px)] bg-surface object-cover"
            />
          </div>
          <span className="intro-item label" style={step(0)}>
            {profile.role}
          </span>
        </div>

        <h1 className="font-name text-[clamp(2.75rem,10vw,5.25rem)] leading-[0.88] font-extrabold tracking-[-0.04em]">
          <span className="sr-only">{profile.name}</span>
          <NameLine text={first} offset={0} />
          <NameLine text={last} offset={first.length} className="text-muted-foreground" />
        </h1>

        <div className="intro-item flex flex-col gap-4" style={step(1)}>
          <p className="max-w-xl text-xl leading-snug text-foreground/90 md:text-2xl">
            <Decrypt text={profile.sentence} />
          </p>
          <Currently items={profile.currently} />
        </div>

        <div className="intro-item" style={step(2)}>
          <HeroMeta />
        </div>

        <div
          className="intro-item grid gap-3 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap"
          style={step(3)}
        >
          {primarySocials.map(social => (
            <MagneticLink
              key={social.id}
              href={social.href}
              aria-label={`${social.label} ${social.handle ?? ''}`.trim()}
              className="group items-center gap-3 rounded-xl border border-line-strong bg-surface/80 py-3 pr-4 pl-3.5 backdrop-blur-sm transition-colors hover:border-teal/40 hover:bg-surface-2 focus-visible:border-teal/40 max-sm:w-full"
            >
              <BrandIcon
                icon={social.icon}
                name={social.label}
                className="size-5 text-foreground"
              />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="font-ui text-sm font-semibold">{social.label}</span>
                {social.handle ? (
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {social.handle}
                  </span>
                ) : null}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal group-focus-visible:text-teal max-sm:ml-auto"
              />
            </MagneticLink>
          ))}
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}
