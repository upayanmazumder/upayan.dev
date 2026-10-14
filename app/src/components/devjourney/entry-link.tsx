import type { ComponentProps } from 'react';
import Link from 'next/link';

import type { RepoEntry } from './contents';
import { hrefFor } from './paths';

interface EntryLinkProps extends Omit<ComponentProps<'a'>, 'href'> {
  entry: RepoEntry;
}

/** Submodules point at other repositories, so they open on GitHub instead of inside the browser. */
export function EntryLink({ entry, ...props }: EntryLinkProps) {
  if (entry.type === 'submodule' && entry.html_url) {
    return <a href={entry.html_url} target="_blank" rel="noreferrer" {...props} />;
  }
  return <Link href={hrefFor(entry.path)} {...props} />;
}
