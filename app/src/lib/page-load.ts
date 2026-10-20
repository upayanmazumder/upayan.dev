/** Class on `<html>` once the preloader starts to lift and the page comes into view. */
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
