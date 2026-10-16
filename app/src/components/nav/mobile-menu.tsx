'use client';

import { useEffect, type Ref } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';

import { navItems } from '@/data/site';
import { useUiStore } from '@/stores/ui-store';

import { MenuFooter } from './menu-footer';
import { NavLink } from './nav-link';
import { linkKind } from './use-nav-action';

interface MobileMenuProps {
  id: string;
  open: boolean;
  ref?: Ref<HTMLDivElement>;
}

/** Small-screen dropdown under the header: page links, socials, and contact. */
export function MobileMenu({ id, open, ref }: MobileMenuProps) {
  const close = useUiStore(state => state.close);

  useEffect(() => {
    if (open) document.getElementById(id)?.querySelector<HTMLElement>('a[href]')?.focus();
  }, [open, id]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="scrim"
            aria-hidden
            className="fixed inset-x-0 top-14 bottom-0 bg-background/80 md:hidden"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <m.div
            key="sheet"
            ref={ref}
            id={id}
            role="dialog"
            aria-label="Site menu"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b border-line bg-background md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="column flex flex-col gap-6 py-4">
              <nav aria-label="Site">
                <ul className="divide-y divide-line">
                  {navItems.map(item => (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        className="flex items-baseline justify-between gap-4 py-3 transition-colors hover:text-teal focus-visible:text-teal"
                      >
                        <span className="text-base font-medium">{item.label}</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          {item.hint}
                          {linkKind(item.href) === 'external' && (
                            <ArrowUpRight aria-hidden className="size-3.5" />
                          )}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <MenuFooter />
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
