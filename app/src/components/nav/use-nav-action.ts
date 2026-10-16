'use client';

import type { MouseEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useUiStore } from '@/stores/ui-store';

type LinkKind = 'external' | 'scheme' | 'anchor' | 'route';

export function linkKind(href: string): LinkKind {
  if (/^https?:\/\//.test(href) || href.endsWith('.pdf')) return 'external';
  if (/^(tel|mailto):/.test(href)) return 'scheme';
  if (href === '/' || href.startsWith('/#')) return 'anchor';
  return 'route';
}

/** Navigation for the menu and palette: closes the overlay, then routes, scrolls, or opens a new tab. */
export function useNavAction() {
  const router = useRouter();
  const pathname = usePathname();
  const close = useUiStore(state => state.close);

  const scrollTo = (href: string) => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    const hash = href.slice(1);
    // `scroll-padding-top` on <html> keeps the target clear of the sticky header.
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior });
    else window.scrollTo({ top: 0, behavior });
  };

  const onHome = pathname === '/';

  const go = (href: string) => {
    close();
    switch (linkKind(href)) {
      case 'external':
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      case 'scheme':
        window.location.assign(href);
        return;
      case 'anchor':
        // Two frames let the overlay cleanup unlock page scrolling first.
        if (onHome) requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(href)));
        else router.push(href);
        return;
      default:
        router.push(href);
    }
  };

  /** For real `<a>` elements: lets the browser or Next handle routes, and smooth-scrolls same-page anchors. */
  const onLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (onHome && linkKind(href) === 'anchor') {
      event.preventDefault();
      go(href);
      return;
    }
    close();
  };

  return { go, onLinkClick };
}
