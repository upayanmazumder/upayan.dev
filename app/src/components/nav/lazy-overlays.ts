import dynamic from 'next/dynamic';

// The menu and palette are only needed after a user action, so their code (cmdk, brand icons, the hologram scene)
// stays out of the initial bundle. Intent (hover or focus on a trigger) starts the fetch before the click lands.
let panelRequested = false;
let sheetRequested = false;
let paletteRequested = false;

/** Phones get the simple liquid sheet. Larger screens get the hologram scene. */
export const PHONE_MENU_QUERY = '(max-width: 767px)';

export function preloadMenu() {
  // Fetch only the menu that this screen size shows.
  if (window.matchMedia(PHONE_MENU_QUERY).matches) {
    if (sheetRequested) return;
    sheetRequested = true;
    void import('./menu-sheet');
    return;
  }
  if (panelRequested) return;
  panelRequested = true;
  void import('./menu-panel');
}

export function preloadPalette() {
  if (paletteRequested) return;
  paletteRequested = true;
  void import('./command-palette');
}

export const MenuPanel = dynamic(() => import('./menu-panel').then(mod => mod.MenuPanel), {
  ssr: false,
});

export const MenuSheet = dynamic(() => import('./menu-sheet').then(mod => mod.MenuSheet), {
  ssr: false,
});

export const CommandPalette = dynamic(
  () => import('./command-palette').then(mod => mod.CommandPalette),
  { ssr: false }
);
