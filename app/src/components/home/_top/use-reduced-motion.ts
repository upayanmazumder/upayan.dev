'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server renders the calm variant; motion-only extras mount after hydration.
const getServerSnapshot = () => true;

/** True when the visitor prefers reduced motion. Always true during SSR and hydration. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
