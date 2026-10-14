'use client';

import { Copy, Phone } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials, primarySocials, profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';
import { useUiStore } from '@/stores/ui-store';

import { useModKey } from './use-mod-key';

const socials = [...primarySocials, ...otherSocials];

/** Bottom row of the menu: socials, contact, palette hint, and local time. */
export function MenuFooter() {
  const copyEmail = useCopyEmail();
  const time = useLocalTime();
  const modKey = useModKey();
  const openOverlay = useUiStore(state => state.open);

  return (
    <div className="flex flex-col gap-4 border-t border-line pt-4 md:gap-6 md:pt-6 lg:flex-row lg:items-end lg:justify-between">
      <ul data-menu-fade className="flex flex-wrap gap-1" aria-label="Social links">
        {socials.map(social => (
          <li key={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              title={social.label}
              className="grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-teal focus-visible:text-teal"
            >
              <BrandIcon icon={social.icon} name={social.label} className="size-4.5" />
            </a>
          </li>
        ))}
      </ul>

      <div data-menu-fade className="flex flex-wrap items-center gap-x-5 gap-y-3 font-ui text-sm">
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex cursor-pointer items-center gap-2 text-foreground transition-colors hover:text-teal focus-visible:text-teal"
        >
          <Copy aria-hidden className="size-3.5" />
          {profile.email}
        </button>
        <a
          href={profile.phoneHref}
          className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
        >
          <Phone aria-hidden className="size-3.5" />
          {profile.phone}
        </a>
        <button
          type="button"
          onClick={() => openOverlay('palette')}
          aria-keyshortcuts="Meta+K Control+K"
          className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground pointer-coarse:hidden"
        >
          <kbd className="rounded-md border border-line-strong bg-surface-2 px-1.5 py-0.5 font-mono text-[0.6875rem] text-foreground">
            {modKey} K
          </kbd>
          Search
        </button>
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          India · IST <span className="text-foreground">{time || '--:--'}</span>
        </p>
      </div>
    </div>
  );
}
