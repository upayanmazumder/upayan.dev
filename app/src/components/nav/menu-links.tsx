'use client';

import { useState, type FocusEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMotionValue, useSpring } from 'motion/react';

import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';

import { LinkPreview } from './link-preview';
import { linkKind, useNavAction } from './use-nav-action';

/** Huge indexed links. Hover or focus shows a preview that trails the cursor and dims the other links. */
export function MenuLinks() {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();
  const [active, setActive] = useState<number | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 240, damping: 26, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 240, damping: 26, mass: 0.6 });

  const onFocus = (index: number, event: FocusEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(rect.left + Math.min(rect.width, 420));
    pointerY.set(rect.top + rect.height / 2);
    setActive(index);
  };

  const preview = active === null ? undefined : navItems[active]?.preview;

  return (
    <nav aria-label="Site" className="w-full">
      <ol
        className="grid gap-x-12 gap-y-1 md:grid-cols-2 md:gap-y-6"
        onPointerMove={event => {
          pointerX.set(event.clientX);
          pointerY.set(event.clientY);
        }}
        onPointerLeave={() => setActive(null)}
      >
        {navItems.map((item, index) => {
          const external = linkKind(item.href) === 'external';
          const current = !item.href.includes('#') && item.href === pathname;
          const className = cn(
            'group/link block py-1 outline-offset-4 transition-opacity duration-300',
            active !== null && active !== index && 'opacity-30'
          );
          const content = (
            <span className="block overflow-hidden pb-1">
              <span data-menu-item className="flex items-baseline gap-4">
                <span
                  aria-hidden
                  className={cn(
                    'w-7 shrink-0 font-mono text-xs tabular-nums transition-colors',
                    current
                      ? 'text-teal'
                      : 'text-muted-foreground group-hover/link:text-teal group-focus-visible/link:text-teal'
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[clamp(2rem,9vw,4.75rem)] leading-[1.02] font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover/link:translate-x-2 group-focus-visible/link:translate-x-2 md:text-[clamp(2.25rem,6.5vw,4.75rem)]">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block font-ui text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                    {item.hint}
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </span>
                </span>
              </span>
            </span>
          );
          return (
            <li key={item.href} onPointerEnter={() => setActive(index)}>
              {external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  onClick={event => onLinkClick(event, item.href)}
                  onFocus={event => onFocus(index, event)}
                  onBlur={() => setActive(null)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                  className={className}
                  onClick={event => onLinkClick(event, item.href)}
                  onFocus={event => onFocus(index, event)}
                  onBlur={() => setActive(null)}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <LinkPreview src={preview} x={x} y={y} />
    </nav>
  );
}
