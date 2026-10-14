'use client';

import Link from 'next/link';
import { CornerLeftUp } from 'lucide-react';
import { m } from 'motion/react';

import { spring, staggerContainer, staggerItemVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';

import type { RepoEntry } from './contents';
import { EntryIcon } from './entry-icon';
import { EntryLink } from './entry-link';
import { hrefFor, parentOf } from './paths';
import { PendingHint } from './pending-hint';

interface FileTreeProps {
  /** Directory whose entries are listed. */
  directory: string;
  entries: RepoEntry[];
  activePath: string;
}

const rowClass =
  'relative flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-mono text-[0.8125rem] transition-colors focus-visible:outline-offset-0';

export function FileTree({ directory, entries, activePath }: FileTreeProps) {
  return (
    <nav aria-label={`Files in ${directory || 'DevJourney'}`}>
      <p className="label mb-3 px-3">{directory ? directory.split('/').at(-1) : 'DevJourney'}</p>
      <m.ul
        variants={staggerContainer(0.025)}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-px"
      >
        {directory ? (
          <m.li variants={staggerItemVariants}>
            <Link
              href={hrefFor(parentOf(directory))}
              aria-label="Up one folder"
              className={cn(
                rowClass,
                'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
              )}
            >
              <CornerLeftUp aria-hidden className="size-4 shrink-0" />
              ..
            </Link>
          </m.li>
        ) : null}
        {entries.map(entry => {
          const active = entry.path === activePath;
          return (
            <m.li key={entry.path} variants={staggerItemVariants}>
              <EntryLink
                entry={entry}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  rowClass,
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                )}
              >
                {active ? (
                  <m.span
                    layoutId="devjourney-tree-active"
                    transition={spring.soft}
                    className="absolute inset-0 rounded-lg border border-line-strong bg-surface-2"
                  >
                    <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-teal" />
                  </m.span>
                ) : null}
                <span className="relative">
                  <PendingHint>
                    <EntryIcon entry={entry} />
                  </PendingHint>
                </span>
                <span className="relative truncate">{entry.name}</span>
              </EntryLink>
            </m.li>
          );
        })}
      </m.ul>
    </nav>
  );
}
