'use client';

import type { ReactNode } from 'react';
import { Mail, Phone, Search } from 'lucide-react';

import { AlienFigure } from '@/components/space';
import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials, primarySocials, profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { useLocalTime } from '@/hooks/use-local-time';
import { useUiStore } from '@/stores/ui-store';

import { useModKey } from './use-mod-key';

const socials = [...primarySocials, ...otherSocials];

const block =
  'grid h-9 min-w-9 place-items-center rounded-md border border-teal/35 bg-surface-2 px-2 text-foreground shadow-[0_6px_14px_-8px_rgba(0,0,0,0.9)] transition-[translate,color,border-color,box-shadow] duration-300 group-hover/alien:-translate-y-1 group-hover/alien:border-teal group-hover/alien:text-teal group-hover/alien:shadow-[0_0_16px_-4px_var(--teal)] focus-visible:border-teal focus-visible:text-teal';

/** One alien on the ground holding a block over its head; the block is the link or button. */
function Holder({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <li data-alien className="group/alien flex shrink-0 flex-col items-center">
      {children}
      <AlienFigure className="-mt-1 w-7 transition-transform duration-300 group-hover/alien:-translate-y-1 group-hover/alien:animate-[alien-hop_0.5s_ease-in-out_infinite] motion-reduce:animate-none" />
      <span className="mt-1 font-mono text-[0.6rem] text-muted-foreground">{caption}</span>
    </li>
  );
}

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
        className="absolute inset-x-0 bottom-[calc(100%-2.25rem)] flex [scrollbar-width:none] items-end gap-2.5 overflow-x-auto px-6 pt-4 md:justify-center md:gap-3.5"
      >
        <Holder caption="email">
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email ${profile.email}`}
            className={block}
          >
            <Mail aria-hidden className="size-4" />
          </button>
        </Holder>
        <Holder caption="call">
          <a href={profile.phoneHref} aria-label={`Call ${profile.phone}`} className={block}>
            <Phone aria-hidden className="size-4" />
          </a>
        </Holder>
        <Holder caption={`${modKey}K`}>
          <button
            type="button"
            onClick={() => openOverlay('palette')}
            aria-label="Search the site"
            aria-keyshortcuts="Meta+K Control+K"
            className={block}
          >
            <Search aria-hidden className="size-4" />
          </button>
        </Holder>
        <Holder caption="IST">
          <span className={`${block} font-mono text-xs tabular-nums`}>
            <span className="sr-only">Local time in India: </span>
            {time || '--:--'}
          </span>
        </Holder>
        <li aria-hidden className="w-4 shrink-0 md:w-8" />
        {socials.map(social => (
          <Holder key={social.id} caption={social.id}>
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
          </Holder>
        ))}
      </ul>
    </div>
  );
}
