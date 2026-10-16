'use client';

import { Copy, Phone } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials, primarySocials, profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';

const socials = [...primarySocials, ...otherSocials];

/** Bottom of the small-screen menu: contact, local time, and socials. */
export function MenuFooter() {
  const copyEmail = useCopyEmail();
  const time = useLocalTime();

  return (
    <div className="flex flex-col gap-4 border-t border-line pt-4">
      <div className="flex flex-col items-start gap-2 text-sm">
        <button
          type="button"
          onClick={() => void copyEmail()}
          aria-label={`Copy email ${profile.email}`}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-foreground transition-colors hover:text-teal focus-visible:text-teal"
        >
          <Copy aria-hidden className="size-3.5 text-muted-foreground" />
          {profile.email}
        </button>
        <a
          href={profile.phoneHref}
          className="inline-flex min-h-10 items-center gap-2 text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
        >
          <Phone aria-hidden className="size-3.5" />
          {profile.phone}
        </a>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          India · IST <time suppressHydrationWarning>{time || '--:--'}</time>
        </p>
      </div>
      <ul className="-mx-2.5 flex flex-wrap" aria-label="Social links">
        {socials.map(social => (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              title={social.label}
              className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
            >
              <BrandIcon icon={social.icon} name={social.label} className="size-4" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
