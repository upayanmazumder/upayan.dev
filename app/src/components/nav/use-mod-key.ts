'use client';

import { useSyncExternalStore } from 'react';

const noop = () => () => {};

/** "⌘" on Apple platforms, "Ctrl" elsewhere. Server render assumes "⌘". */
export function useModKey(): string {
  return useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'),
    () => '⌘'
  );
}
