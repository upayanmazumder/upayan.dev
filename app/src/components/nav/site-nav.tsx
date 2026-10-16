'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { useUiStore, type Overlay } from '@/stores/ui-store';

import { CommandPalette } from './command-palette';
import { MobileMenu } from './mobile-menu';
import { SiteHeader } from './site-header';
import { useMediaQuery } from './use-media-query';
import { useOverlayLock } from './use-overlay-lock';

const MENU_ID = 'site-menu';
const PALETTE_ID = 'command-palette';

/** Sticky site header with its small-screen menu sheet and the Cmd/Ctrl+K palette. */
export function SiteNav() {
  const overlay = useUiStore(state => state.overlay);
  const toggle = useUiStore(state => state.toggle);
  const close = useUiStore(state => state.close);
  const pathname = usePathname();
  const wide = useMediaQuery('(min-width: 48rem)');

  const rootRef = useRef<HTMLDivElement>(null);
  const menuTrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useOverlayLock(overlay === 'menu', rootRef, menuTrapRef);
  useOverlayLock(overlay === 'palette', rootRef, paletteRef);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle('palette');
      } else if (event.key === 'Escape' && useUiStore.getState().overlay) {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle, close]);

  // Back/forward navigation while an overlay is open should not leave it covering the new page.
  useEffect(() => {
    close();
  }, [pathname, close]);

  // The sheet is hidden on wide screens, so a menu left open across a resize would lock the page invisibly.
  useEffect(() => {
    if (wide && useUiStore.getState().overlay === 'menu') close();
  }, [wide, close]);

  // Focus returns to what opened the overlay; the menu button when that element is gone or inside the sheet.
  const previous = useRef<Overlay>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const was = previous.current;
    previous.current = overlay;
    if (!was && overlay) {
      opener.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      return;
    }
    if (!was || overlay) return;
    const target = opener.current;
    opener.current = null;
    const usable =
      target &&
      target !== document.body &&
      target.isConnected &&
      target.getClientRects().length > 0 &&
      !sheetRef.current?.contains(target);
    if (usable) target.focus({ preventScroll: true });
    else if (was === 'menu') menuButtonRef.current?.focus({ preventScroll: true });
  }, [overlay]);

  return (
    // `contents` keeps the sticky bar's containing block at <body> and the palette outside the bar's stacking context.
    <div ref={rootRef} data-site-nav className="contents">
      <div ref={menuTrapRef} className="sticky top-0 z-40">
        <SiteHeader
          menuOpen={overlay === 'menu'}
          menuId={MENU_ID}
          menuButtonRef={menuButtonRef}
          paletteOpen={overlay === 'palette'}
          paletteId={PALETTE_ID}
        />
        <MobileMenu ref={sheetRef} id={MENU_ID} open={overlay === 'menu'} />
      </div>
      <CommandPalette ref={paletteRef} id={PALETTE_ID} open={overlay === 'palette'} />
    </div>
  );
}
