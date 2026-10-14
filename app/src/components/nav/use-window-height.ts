'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange);
  return () => window.removeEventListener('resize', onChange);
};

/** Viewport height in px; 0 on the server and during hydration. */
export function useWindowHeight(): number {
  return useSyncExternalStore(
    subscribe,
    () => window.innerHeight,
    () => 0
  );
}
