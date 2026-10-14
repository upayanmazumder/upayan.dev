'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { useUiStore, type Overlay } from '@/stores/ui-store';

import { CommandPalette } from './command-palette';
import { EdgeTab } from './edge-tab';
import { MenuPanel } from './menu-panel';
import { TopMark } from './top-mark';
import { useOverlayLock } from './use-overlay-lock';

const MENU_ID = 'site-menu';
const PALETTE_ID = 'command-palette';

/** Site navigation: liquid edge tab with its full-screen menu, the top-left mark, and the Cmd/Ctrl+K palette. */
export function SiteNav() {
  const overlay = useUiStore(state => state.overlay);
  const toggle = useUiStore(state => state.toggle);
  const close = useUiStore(state => state.close);
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  useOverlayLock(overlay === 'menu', rootRef, menuRef);
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
      <TopMark
        paletteOpen={overlay === 'palette'}
        paletteId={PALETTE_ID}
        covered={overlay === 'menu'}
      />
      <div ref={menuRef}>
        <MenuPanel id={MENU_ID} open={overlay === 'menu'} tabRef={tabRef} />
        <EdgeTab
          ref={tabRef}
          open={overlay === 'menu'}
          controls={MENU_ID}
          onToggle={() => toggle('menu')}
        />
      </div>
      <CommandPalette ref={paletteRef} id={PALETTE_ID} open={overlay === 'palette'} />
    </div>
  );
}
