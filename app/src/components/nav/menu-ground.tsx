'use client';

import { Mail, Phone, Search } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials, primarySocials, profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';
import { useUiStore } from '@/stores/ui-store';

import { AlienHolder } from './alien-holder';
import { useModKey } from './use-mod-key';

const socials = [...primarySocials, ...otherSocials];
// The contact blocks come first, so each social takes the index after them.
const CONTACTS = 4;

const block =
  'relative grid h-9 min-w-9 place-items-center rounded-md border border-teal/35 bg-surface-2 px-2 text-foreground shadow-[0_6px_14px_-8px_rgba(0,0,0,0.9)] transition-[color,border-color,box-shadow] duration-300 group-hover/alien:border-teal group-hover/alien:text-teal group-hover/alien:shadow-[0_0_16px_-4px_var(--teal)] focus-visible:border-teal focus-visible:text-teal focus-visible:shadow-[0_0_16px_-4px_var(--teal)]';

/**
 * The planet surface at the foot of the menu. A crowd of aliens stands on it, each holding up a
 * block: contact first (copy email, call, search, local time), then every social profile.
 */
export function MenuGround() {
  const copyEmail = useCopyEmail();
  const time = useLocalTime();
  const modKey = useModKey();
  const openOverlay = useUiStore(state => state.open);

  return (
    <div data-ground className="absolute inset-x-0 bottom-0 h-(--ground)">
      <div
        aria-hidden
        className="absolute -inset-x-[10%] top-0 bottom-0 rounded-t-[50%_3rem] border-t border-teal/30 bg-[oklch(0.17_0.014_165)] shadow-[0_-24px_70px_-36px_var(--teal)]"
      >
        <span className="absolute top-[38%] left-[22%] h-3 w-8 rounded-[50%] bg-background/40" />
        <span className="absolute top-[60%] left-[64%] h-4 w-12 rounded-[50%] bg-background/35" />
        <span className="absolute top-[30%] left-[78%] h-2 w-5 rounded-[50%] bg-background/40" />
      </div>
      <ul
        aria-label="Contact and profiles"
        className="absolute inset-x-0 bottom-[calc(100%-2.25rem)] flex [scrollbar-width:none] items-end justify-center-safe gap-2.5 overflow-x-auto px-6 pt-6 md:gap-1.5 md:px-4 lg:gap-3.5 lg:px-6"
      >
        <AlienHolder index={0} caption="email">
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email ${profile.email}`}
            className={block}
          >
            <Mail aria-hidden className="size-4" />
          </button>
        </AlienHolder>
        <AlienHolder index={1} caption="call">
          <a href={profile.phoneHref} aria-label={`Call ${profile.phone}`} className={block}>
            <Phone aria-hidden className="size-4" />
          </a>
        </AlienHolder>
        <AlienHolder index={2} caption={`${modKey}K`}>
          <button
            type="button"
            onClick={() => openOverlay('palette')}
            aria-label="Search the site"
            aria-keyshortcuts="Meta+K Control+K"
            className={block}
          >
            <Search aria-hidden className="size-4" />
          </button>
        </AlienHolder>
        <AlienHolder index={CONTACTS - 1} caption="IST">
          <span className={`${block} font-mono text-xs tabular-nums`}>
            <span className="sr-only">Local time in India: </span>
            {time || '--:--'}
          </span>
        </AlienHolder>
        <li aria-hidden className="w-4 shrink-0 md:w-3 lg:w-8" />
        {socials.map((social, index) => (
          <AlienHolder key={social.id} index={CONTACTS + index} caption={social.id}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              title={social.label}
              className={block}
            >
              <BrandIcon icon={social.icon} name={social.label} className="size-4" />
            </a>
          </AlienHolder>
        ))}
      </ul>
    </div>
  );
}
