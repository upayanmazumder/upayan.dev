'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useUiStore, type Overlay } from '@/stores/ui-store';

import { CommandPalette, MenuPanel, preloadPalette } from './lazy-overlays';
import { TopMark } from './top-mark';
import { UfoTab } from './ufo-tab';
import { useOverlayLock } from './use-overlay-lock';

const MENU_ID = 'site-menu';
const PALETTE_ID = 'command-palette';

/** Site navigation: the UFO menu button with its full-screen menu, the top-left mark, and the Cmd/Ctrl+K palette. */
export function SiteNav() {
  const overlay = useUiStore(state => state.overlay);
  const toggle = useUiStore(state => state.toggle);
  const close = useUiStore(state => state.close);
  const pathname = usePathname();
  const menuOpen = overlay === 'menu';
  const paletteOpen = overlay === 'palette';

  // The menu stays mounted from open until its close animation reports back, then its whole subtree goes.
  const [menuMounted, setMenuMounted] = useState(menuOpen);
  if (menuOpen && !menuMounted) setMenuMounted(true);
  // The palette renders nothing while closed (AnimatePresence handles its exit), so once loaded it can stay.
  const [paletteLoaded, setPaletteLoaded] = useState(paletteOpen);
  if (paletteOpen && !paletteLoaded) setPaletteLoaded(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  useOverlayLock(menuOpen, rootRef, menuRef);
  useOverlayLock(paletteOpen, rootRef, paletteRef);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Holding the modifier is intent for Cmd/Ctrl+K: fetch the palette before K lands.
      if (event.key === 'Meta' || event.key === 'Control') preloadPalette();
      else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
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

  // Focus returns to what opened the overlay; the edge tab when that element is gone or hidden in the menu.
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
      !menuRef.current?.contains(target);
    if (usable) target.focus({ preventScroll: true });
    else if (was === 'menu' || menuRef.current?.contains(target))
      tabRef.current?.focus({ preventScroll: true });
  }, [overlay]);

  return (
    <div ref={rootRef} data-site-nav>
      <TopMark paletteOpen={paletteOpen} paletteId={PALETTE_ID} covered={menuOpen} />
      <div ref={menuRef}>
        {menuMounted && (
          <MenuPanel
            id={MENU_ID}
            open={menuOpen}
            tabRef={tabRef}
            onClosed={() => setMenuMounted(false)}
          />
        )}
        <UfoTab
          buttonRef={tabRef}
          open={menuOpen}
          controls={menuMounted ? MENU_ID : undefined}
          onToggle={() => toggle('menu')}
        />
      </div>
      {paletteLoaded && <CommandPalette ref={paletteRef} id={PALETTE_ID} open={paletteOpen} />}
    </div>
  );
}
