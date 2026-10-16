'use client';

import { useRef, type FocusEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMotionValue, useSpring } from 'motion/react';

import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';

import { LinkPreview } from './link-preview';
import { linkKind, useNavAction } from './use-nav-action';

const previews = navItems.map(item => item.preview);

/** Large indexed links. Hover or focus shows a preview that trails the cursor and dims the other links. */
export function MenuLinks() {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();
  const listRef = useRef<HTMLOListElement>(null);
  // Hover lives in data attributes and a motion value, so moving between links re-renders only the preview.
  const active = useMotionValue(-1);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 220, damping: 28, mass: 0.6 });
  const y = useSpring(pointerY, { stiffness: 220, damping: 28, mass: 0.6 });

  const activate = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    list.toggleAttribute('data-dim', index >= 0);
    for (const [i, item] of [...list.children].entries())
      item.toggleAttribute('data-active', i === index);
    active.set(index);
  };

  const onFocus = (index: number, event: FocusEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(rect.left + Math.min(rect.width, 420));
    pointerY.set(rect.top + rect.height / 2);
    activate(index);
  };

  return (
    <nav aria-label="Site" className="w-full">
      <ol
        ref={listRef}
        className="grid gap-x-12 gap-y-1 md:grid-cols-2 md:gap-y-6 [&[data-dim]>li:not([data-active])>a]:opacity-30"
        onPointerMove={event => {
          pointerX.set(event.clientX);
          pointerY.set(event.clientY);
        }}
        onPointerLeave={() => activate(-1)}
      >
        {navItems.map((item, index) => {
          const external = linkKind(item.href) === 'external';
          const current = !item.href.includes('#') && item.href === pathname;
          const className =
            'group/link block py-1 outline-offset-4 transition-opacity duration-300';
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
                  <span className="block font-display text-[clamp(1.875rem,8vw,4rem)] leading-[1.02] font-medium tracking-tight transition-transform duration-300 ease-out-expo group-hover/link:translate-x-1.5 group-focus-visible/link:translate-x-1.5 md:text-[clamp(2rem,5.5vw,4rem)]">
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
            <li key={item.href} onPointerEnter={() => activate(index)}>
              {external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  onClick={event => onLinkClick(event, item.href)}
                  onFocus={event => onFocus(index, event)}
                  onBlur={() => activate(-1)}
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
                  onBlur={() => activate(-1)}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <LinkPreview sources={previews} active={active} x={x} y={y} />
    </nav>
  );
}
