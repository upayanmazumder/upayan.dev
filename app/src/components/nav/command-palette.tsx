'use client';

import type { ReactNode, Ref } from 'react';
import { Command } from 'cmdk';
import { Copy, FileText, Phone, Search } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';
import { EASE } from '@/lib/motion';
import { useUiStore } from '@/stores/ui-store';

import { paletteGroups } from './palette-entries';
import { useNavAction } from './use-nav-action';

interface CommandPaletteProps {
  open: boolean;
  id: string;
  ref?: Ref<HTMLDivElement>;
}

const itemClass =
  'group/item flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors data-[selected=true]:bg-teal-dim data-[selected=true]:text-foreground';

function Row({ icon, label, hint }: { icon: ReactNode; label: string; hint: string }) {
  return (
    <>
      <span className="grid size-4 shrink-0 place-items-center text-muted-foreground group-data-[selected=true]/item:text-teal">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate font-ui text-foreground">{label}</span>
      <span className="shrink-0 truncate font-mono text-[0.6875rem] text-muted-foreground">
        {hint}
      </span>
    </>
  );
}

function GroupHeading({ children }: { children: ReactNode }) {
  return <span className="label block px-3 pt-3 pb-1.5">{children}</span>;
}

/** Cmd/Ctrl+K dialog: pages, sections, projects, links, and quick actions. */
export function CommandPalette({ open, id, ref }: CommandPaletteProps) {
  const close = useUiStore(state => state.close);
  const { go } = useNavAction();
  const copyEmail = useCopyEmail();

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="palette"
          className="fixed inset-0 z-70 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
          />
          <m.div
            ref={ref}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-2xl shadow-black/60"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE.out }}
          >
            <Command label="Command palette" loop className="flex max-h-[min(32rem,70vh)] flex-col">
              <div className="flex items-center gap-3 border-b border-line px-4">
                <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  autoFocus
                  placeholder="Search pages, projects, links…"
                  className="h-12 w-full bg-transparent font-ui text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <kbd className="shrink-0 rounded-md border border-line-strong px-1.5 py-0.5 font-mono text-[0.625rem] text-muted-foreground">
                  esc
                </kbd>
              </div>
              <Command.List data-lenis-prevent className="overflow-y-auto overscroll-contain p-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nothing matches that.
                </Command.Empty>
                {paletteGroups.map(group => (
                  <Command.Group
                    key={group.heading}
                    value={group.heading}
                    heading={<GroupHeading>{group.heading}</GroupHeading>}
                  >
                    {group.entries.map(entry => (
                      <Command.Item
                        key={entry.value}
                        value={entry.value}
                        keywords={entry.keywords}
                        onSelect={() => go(entry.href)}
                        className={itemClass}
                      >
                        <Row
                          icon={
                            entry.brand ? (
                              <BrandIcon
                                icon={entry.brand}
                                name={entry.label}
                                className="size-3.5"
                              />
                            ) : (
                              entry.Icon && <entry.Icon aria-hidden className="size-3.5" />
                            )
                          }
                          label={entry.label}
                          hint={entry.hint}
                        />
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
                <Command.Group value="Actions" heading={<GroupHeading>Actions</GroupHeading>}>
                  <Command.Item
                    value="action copy email"
                    keywords={['mail', 'contact', profile.email]}
                    onSelect={() => {
                      close();
                      void copyEmail();
                    }}
                    className={itemClass}
                  >
                    <Row
                      icon={<Copy aria-hidden className="size-3.5" />}
                      label="Copy email"
                      hint={profile.email}
                    />
                  </Command.Item>
                  <Command.Item
                    value="action open resume"
                    keywords={['cv', 'pdf']}
                    onSelect={() => go(profile.resume)}
                    className={itemClass}
                  >
                    <Row
                      icon={<FileText aria-hidden className="size-3.5" />}
                      label="Open resume"
                      hint="PDF"
                    />
                  </Command.Item>
                  <Command.Item
                    value="action call"
                    keywords={['phone', 'call', profile.phone]}
                    onSelect={() => go(profile.phoneHref)}
                    className={itemClass}
                  >
                    <Row
                      icon={<Phone aria-hidden className="size-3.5" />}
                      label="Call"
                      hint={profile.phone}
                    />
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <div
                aria-hidden
                className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[0.625rem] text-muted-foreground"
              >
                <span>↑↓ move</span>
                <span>↵ open</span>
                <span>esc close</span>
              </div>
            </Command>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
