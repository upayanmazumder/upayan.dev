'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

function subscribeVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

/** True while the tab is visible. Server and first render assume visible. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true
  );
}

/** True while `ref` is near the viewport. `rootMargin` widens the band so work starts just before it shows. */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = '200px'): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {
        rootMargin,
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** True only while `ref` is near the viewport and the tab is visible. Gate loops, timers, and polling on this. */
export function useActive(ref: RefObject<Element | null>, rootMargin?: string): boolean {
  const inView = useInViewport(ref, rootMargin);
  const visible = usePageVisible();
  return inView && visible;
}
