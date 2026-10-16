'use client';

import type { Ref } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { profile } from '@/data/profile';
import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';

import { NavLink } from './nav-link';
import { useModKey } from './use-mod-key';
import { useNavAction } from './use-nav-action';

interface SiteHeaderProps {
  menuOpen: boolean;
  menuId: string;
  menuButtonRef: Ref<HTMLButtonElement>;
  paletteOpen: boolean;
  paletteId: string;
}

// Home is the name link and the resume lives in the palette, menu, and footer; the bar keeps to four links.
const headerLinks = navItems.filter(item => item.href !== '/' && !item.href.endsWith('.pdf'));

const control =
  'inline-flex h-10 cursor-pointer items-center gap-2 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground';

/** Sticky top bar: name home link, primary links on wide screens, palette and menu buttons. */
export function SiteHeader({
  menuOpen,
  menuId,
  menuButtonRef,
  paletteOpen,
  paletteId,
}: SiteHeaderProps) {
  const modKey = useModKey();
  const toggle = useUiStore(state => state.toggle);
  const { onLinkClick } = useNavAction();

  return (
    <header className="border-b border-line bg-background/90 backdrop-blur-sm">
      <div className="column flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={`${profile.name}, home`}
          onClick={event => onLinkClick(event, '/')}
          className="-mx-1 rounded-md px-1 py-2 text-sm font-semibold text-foreground transition-colors hover:text-teal"
        >
          {profile.name}
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center">
              {headerLinks.map(item => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    className="inline-flex h-10 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal aria-[current=page]:text-foreground"
                  />
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => toggle('palette')}
            aria-label="Open command palette"
            aria-haspopup="dialog"
            aria-expanded={paletteOpen}
            aria-controls={paletteOpen ? paletteId : undefined}
            aria-keyshortcuts="Meta+K Control+K"
            className={control}
          >
            <Search aria-hidden className="size-4 shrink-0" />
            <kbd
              aria-hidden
              className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-xs md:inline-block"
            >
              {modKey} K
            </kbd>
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => toggle('menu')}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            className={cn(control, 'text-foreground md:hidden')}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
    </header>
  );
}
