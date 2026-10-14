'use client';

import { useEffect, useState } from 'react';

// Matches the hero intro timeline, so the live panel never competes with the name reveal.
const INTRO_MS = 1800;
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/** True once the page has loaded and the hero intro has played. Reduced motion skips the wait. */
export function useAfterIntro(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer = 0;
    let idle = 0;
    const start = () => {
      const delay = window.matchMedia(REDUCED_QUERY).matches ? 0 : INTRO_MS;
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) {
          idle = window.requestIdleCallback(() => setReady(true), { timeout: 600 });
        } else {
          setReady(true);
        }
      }, delay);
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return ready;
}
