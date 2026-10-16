import { ArrowUpRight, ChevronRight } from 'lucide-react';

import type { RepoEntry } from './contents';
import { EntryIcon } from './entry-icon';
import { EntryLink } from './entry-link';
import { extensionOf, formatBytes } from './paths';
import { PendingHint } from './pending-hint';

interface DirectoryListProps {
  entries: RepoEntry[];
}

function typeLabel(entry: RepoEntry): string {
  if (entry.type === 'dir') return 'Folder';
  if (entry.type === 'submodule') return 'Submodule';
  if (entry.type === 'symlink') return 'Link';
  return extensionOf(entry.name).toUpperCase() || 'File';
}

export function DirectoryList({ entries }: DirectoryListProps) {
  if (entries.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-muted-foreground">This folder is empty.</p>
    );
  }

  return (
    <ul className="divide-y divide-line" aria-label="Folder contents">
      {entries.map(entry => (
        <li key={entry.path}>
          <EntryLink
            entry={entry}
            className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-3 px-5 py-3 transition-colors hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-offset-[-2px] sm:grid-cols-[auto_1fr_6rem_5rem_auto]"
          >
            <EntryIcon entry={entry} />
            <span className="truncate font-mono text-sm text-foreground">{entry.name}</span>
            <span className="label hidden text-right sm:block">{typeLabel(entry)}</span>
            <span className="hidden text-right font-mono text-xs text-muted-foreground tabular-nums sm:block">
              {entry.type === 'file' ? formatBytes(entry.size) : '—'}
            </span>
            {entry.type === 'submodule' ? (
              <ArrowUpRight aria-hidden className="size-4 text-muted-foreground" />
            ) : (
              <PendingHint>
                <ChevronRight
                  aria-hidden
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </PendingHint>
            )}
          </EntryLink>
        </li>
      ))}
    </ul>
  );
}
