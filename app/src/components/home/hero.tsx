import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials, profile } from '@/data/profile';

import { Currently } from './_top/hero/currently';
import { Decrypt } from './_top/hero/decrypt';
import { HeroBackdrop } from './_top/hero/hero-backdrop';
import { HeroIntro } from './_top/hero/hero-intro';
import { HeroMeta } from './_top/hero/hero-meta';
import { MagneticLink } from './_top/hero/magnetic-link';
import { ScrollCue } from './_top/hero/scroll-cue';

/** Full-height intro inside the rails: photo, name, one sentence, status, contact, and primary socials. */
export function Hero() {
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="hero" aria-label="Intro" className="relative isolate flex min-h-svh flex-col">
      <HeroBackdrop />
      <HeroIntro className="column flex flex-1 flex-col justify-center gap-7 pt-28 pb-36">
        <div className="flex items-center gap-5">
          <div
            data-intro="photo"
            className="relative size-20 shrink-0 overflow-hidden rounded-2xl p-px md:size-24"
          >
            <span
              aria-hidden
              className="absolute -inset-1/2 animate-spin bg-[conic-gradient(from_0deg,transparent_0deg,var(--teal)_70deg,transparent_140deg)] opacity-80 [animation-duration:9s] motion-reduce:animate-none"
            />
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
          <div data-intro="item" className="flex flex-col items-start gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-teal/25 bg-teal-dim px-2.5 py-1 font-ui text-xs font-medium text-teal">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-60 motion-reduce:animate-none" />
                <span className="relative size-2 rounded-full bg-teal" />
              </span>
              {profile.status}
            </span>
            <span className="label">{profile.role}</span>
          </div>
        </div>

        <h1
          data-intro="name"
          className="text-[clamp(3rem,11vw,5.75rem)] leading-[0.92] font-semibold tracking-[-0.035em]"
        >
          <span className="block">{first}</span>{' '}
          <span className="block text-muted-foreground">{rest.join(' ')}</span>
        </h1>

        <div data-intro="item" className="flex flex-col gap-4">
          <p className="max-w-xl text-xl leading-snug text-foreground/90 md:text-2xl">
            <Decrypt text={profile.sentence} />
          </p>
          <Currently items={profile.currently} />
        </div>

        <div data-intro="item">
          <HeroMeta />
        </div>

        <div data-intro="item" className="flex flex-wrap gap-3">
          {primarySocials.map(social => (
            <MagneticLink
              key={social.id}
              href={social.href}
              aria-label={`${social.label} ${social.handle ?? ''}`.trim()}
              className="group items-center gap-3 rounded-xl border border-line-strong bg-surface/80 py-3 pr-4 pl-3.5 backdrop-blur-sm transition-colors hover:border-teal/40 hover:bg-surface-2 focus-visible:border-teal/40"
            >
              <BrandIcon
                icon={social.icon}
                name={social.label}
                className="size-5 text-foreground"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-ui text-sm font-semibold">{social.label}</span>
                {social.handle ? (
                  <span className="font-mono text-xs text-muted-foreground">{social.handle}</span>
                ) : null}
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal group-focus-visible:text-teal"
              />
            </MagneticLink>
          ))}
        </div>
      </HeroIntro>
      <ScrollCue />
    </section>
  );
}
