'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';

import { linkKind, useNavAction } from './use-nav-action';

/** Large indexed links for the phone menu. The current page shows its index in teal. */
export function MenuLinks() {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();

  return (
    <nav aria-label="Site" className="w-full">
      <ol className="grid gap-y-1">
        {navItems.map((item, index) => {
          const external = linkKind(item.href) === 'external';
          const current = !item.href.includes('#') && item.href === pathname;
          const className = 'group/link block py-1 outline-offset-4';
          // The clip wrapper hides each row until the sheet raises it into view.
          const content = (
            <span className="block overflow-hidden pb-1">
              <span data-menu-item className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className={cn(
                    'w-7 shrink-0 font-mono text-xs tabular-nums transition-colors',
                    current
                      ? 'text-teal'
                      : 'text-muted-foreground group-focus-visible/link:text-teal group-active/link:text-teal'
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[clamp(1.875rem,8vw,3rem)] leading-[1.02] font-medium tracking-tight">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block font-ui text-xs text-muted-foreground">
                    {item.hint}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </span>
                </span>
              </span>
            </span>
          );
          return (
            <li key={item.href}>
              {external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  onClick={event => onLinkClick(event, item.href)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={className}
                  onClick={event => onLinkClick(event, item.href)}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
