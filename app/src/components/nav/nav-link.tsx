'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { NavItem } from '@/data/site';

import { linkKind, useNavAction } from './use-nav-action';

interface NavLinkProps {
  item: NavItem;
  className: string;
  children?: ReactNode;
}

/** Site link that closes overlays, scrolls same-page anchors, and opens PDFs and external links in a new tab. */
export function NavLink({ item, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();
  const content = children ?? item.label;

  if (linkKind(item.href) === 'external') {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={className}
        onClick={event => onLinkClick(event, item.href)}
      >
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  const current = !item.href.includes('#') && item.href === pathname;
  return (
    <Link
      href={item.href}
      aria-current={current ? 'page' : undefined}
      className={className}
      onClick={event => onLinkClick(event, item.href)}
    >
      {content}
    </Link>
  );
}
