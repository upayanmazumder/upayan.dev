import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { hrefFor } from './paths';

interface BreadcrumbProps {
  path: string;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  const segments = path ? path.split('/') : [];
  const crumbs = [
    { label: 'DevJourney', path: '' },
    ...segments.map((label, index) => ({ label, path: segments.slice(0, index + 1).join('/') })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-sm">
        {crumbs.map((crumb, index) => {
          const current = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex min-w-0 items-center gap-1">
              {index > 0 ? (
                <ChevronRight aria-hidden className="size-3.5 shrink-0 text-muted-foreground/60" />
              ) : null}
              {current ? (
                <span aria-current="page" className="truncate text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={hrefFor(crumb.path)}
                  className="truncate rounded text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
