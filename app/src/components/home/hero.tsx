import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials, profile } from '@/data/profile';

import { HeroMeta } from './_top/hero/hero-meta';

/** Intro: photo, name, role, one sentence, what I'm doing now, contact, and primary socials. */
export function Hero() {
  return (
    <section id="hero" aria-label="Intro">
      <div className="column flex flex-col gap-8 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="flex items-center gap-4">
          <Image
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            width={128}
            height={128}
            preload
            className="size-16 shrink-0 rounded-full border border-line bg-surface object-cover"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-4xl leading-tight md:text-5xl">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.role}</p>
          </div>
        </div>

        <div className="flex max-w-prose flex-col gap-3">
          <p className="text-xl leading-snug text-foreground md:text-2xl">{profile.sentence}</p>
          <p className="text-muted-foreground">
            Currently <span className="text-foreground">{profile.currently.join('; ')}</span>
          </p>
        </div>

        <HeroMeta />

        <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Profiles">
          {primarySocials.map(social => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.label} ${social.handle ?? ''}`.trim()}
                className="group inline-flex min-h-10 items-center gap-2 text-sm transition-colors hover:text-teal focus-visible:text-teal"
              >
                <BrandIcon icon={social.icon} name={social.label} className="size-4" />
                <span className="font-medium">{social.label}</span>
                {social.handle ? (
                  <span className="font-mono text-xs text-muted-foreground">{social.handle}</span>
                ) : null}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
