'use client';

import { useEffect, useState } from 'react';

/** True once the page has loaded and the browser is idle, so live polling never competes with first paint. */
export function useAfterLoad(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    const start = () => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 1000 });
      } else {
        setReady(true);
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      window.removeEventListener('load', start);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, []);

  return ready;
}
