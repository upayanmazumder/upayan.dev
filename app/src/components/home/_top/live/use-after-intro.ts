'use client';

import { useEffect, useState } from 'react';

import { afterReveal } from '@/lib/page-load';

/**
 * True once the preloader has revealed the page. The preloader already fetches the first live
 * snapshot, so polling only has to wait until the page is on screen.
 */
export function useAfterIntro(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => afterReveal(0, () => setReady(true)), []);
  return ready;
}
