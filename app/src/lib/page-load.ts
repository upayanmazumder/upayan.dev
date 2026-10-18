/** `performance.now()` at the end of the load event, or now if the browser does not report it. */
export function loadedAt(): number {
  const [entry] = performance.getEntriesByType('navigation');
  return entry instanceof PerformanceNavigationTiming && entry.loadEventEnd > 0
    ? entry.loadEventEnd
    : performance.now();
}

/**
 * Runs `callback` once, `delayMs` after the page's load event. Returns a cancel function. The load
 * event's end time is recorded only after its handlers return, so a pending load arms one tick later.
 */
export function afterLoad(delayMs: number, callback: () => void): () => void {
  let timer = 0;
  const arm = () => {
    timer = window.setTimeout(callback, Math.max(0, loadedAt() + delayMs - performance.now()));
  };
  const onLoad = () => {
    timer = window.setTimeout(arm, 0);
  };
  if (document.readyState === 'complete') arm();
  else window.addEventListener('load', onLoad, { once: true });
  return () => {
    window.removeEventListener('load', onLoad);
    window.clearTimeout(timer);
  };
}

/** Class on `<html>` once the preloader has lifted and the page is on screen. */
export const REVEALED_CLASS = 'ufo-landed';
/** Window event fired at the same moment the class is added. */
export const REVEALED_EVENT = 'ufo-landed';

/** Runs `callback` once, `delayMs` after the preloader has revealed the page. Returns a cancel function. */
export function afterReveal(delayMs: number, callback: () => void): () => void {
  let timer = 0;
  const arm = () => {
    timer = window.setTimeout(callback, delayMs);
  };
  if (document.documentElement.classList.contains(REVEALED_CLASS)) arm();
  else window.addEventListener(REVEALED_EVENT, arm, { once: true });
  return () => {
    window.removeEventListener(REVEALED_EVENT, arm);
    window.clearTimeout(timer);
  };
}
