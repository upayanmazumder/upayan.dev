'use client';

import { useEffect, type RefObject } from 'react';

import { useLenis } from '@/components/shell/smooth-scroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * While `active`: stops Lenis, locks page scroll, makes everything outside `root` inert, and keeps Tab inside `trap`.
 * The trap is separate from the root so the menu can trap the panel plus its edge tab, and the palette only itself.
 */
export function useOverlayLock(
  active: boolean,
  root: RefObject<HTMLElement | null>,
  trap: RefObject<HTMLElement | null>
) {
  const lenis = useLenis();

  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const { body } = document;
    const scrollbar = window.innerWidth - html.clientWidth;
    const previous = { overflow: html.style.overflow, paddingRight: body.style.paddingRight };

    lenis?.stop();
    html.style.setProperty('overflow', 'hidden');
    if (scrollbar > 0) body.style.setProperty('padding-right', `${scrollbar}px`);

    const inerted: HTMLElement[] = [];
    const self = root.current;
    for (const el of self?.parentElement?.children ?? []) {
      if (el === self || !(el instanceof HTMLElement) || el.hasAttribute('inert')) continue;
      // Toasts and the Next dev overlay stay usable while an overlay is open.
      if (
        el.tagName === 'NEXTJS-PORTAL' ||
        el.hasAttribute('aria-live') ||
        el.querySelector('[data-sonner-toaster]')
      )
        continue;
      el.setAttribute('inert', '');
      inerted.push(el);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const container = trap.current;
      if (event.key !== 'Tab' || !container) return;
      const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        el =>
          !el.closest('[inert]') &&
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility !== 'hidden'
      );
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const current = document.activeElement;
      if (!container.contains(current)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      for (const el of inerted) el.removeAttribute('inert');
      html.style.setProperty('overflow', previous.overflow);
      body.style.setProperty('padding-right', previous.paddingRight);
      lenis?.start();
    };
  }, [active, lenis, root, trap]);
}
