import dynamic from 'next/dynamic';

// The menu and palette are only needed after a user action, so their code (cmdk, brand icons, the hologram scene)
// stays out of the initial bundle. Intent (hover or focus on a trigger) starts the fetch before the click lands.
let menuRequested = false;
let paletteRequested = false;

export function preloadMenu() {
  if (menuRequested) return;
  menuRequested = true;
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

export const CommandPalette = dynamic(
  () => import('./command-palette').then(mod => mod.CommandPalette),
  { ssr: false }
);
