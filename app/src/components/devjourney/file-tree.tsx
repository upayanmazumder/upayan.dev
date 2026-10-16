import Link from 'next/link';
import { CornerLeftUp } from 'lucide-react';

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
  'flex items-center gap-2.5 rounded-md px-3 py-1.5 font-mono text-[0.8125rem] transition-colors focus-visible:outline-offset-0';

export function FileTree({ directory, entries, activePath }: FileTreeProps) {
  return (
    <nav aria-label={`Files in ${directory || 'DevJourney'}`}>
      <p className="label mb-3 px-3">{directory ? directory.split('/').at(-1) : 'DevJourney'}</p>
      <ul className="flex flex-col gap-px">
        {directory ? (
          <li>
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
          </li>
        ) : null}
        {entries.map(entry => {
          const active = entry.path === activePath;
          return (
            <li key={entry.path}>
              <EntryLink
                entry={entry}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  rowClass,
                  active
                    ? 'bg-surface-2 font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                )}
              >
                <PendingHint>
                  <EntryIcon entry={entry} />
                </PendingHint>
                <span className="truncate">{entry.name}</span>
              </EntryLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
