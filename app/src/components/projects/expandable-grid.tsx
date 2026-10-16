'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ExpandableGridProps {
  /** Server-rendered rows, keyed by id. */
  items: { id: string; node: ReactNode }[];
  initial?: number;
}

/** Two-column list that shows `initial` items and reveals the rest on demand. */
export function ExpandableGrid({ items, initial = 8 }: ExpandableGridProps) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const visible = expanded ? items : items.slice(0, initial);

  const toggle = () => {
    // Collapsing from below would leave the reader past the shortened list; bring its top back into view.
    if (expanded && root.current && root.current.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      root.current.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
    setExpanded(!expanded);
  };

  return (
    <div ref={root} className="flex flex-col gap-6">
      <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
        {visible.map(item => (
          <li key={item.id} className="border-b border-line">
            {item.node}
          </li>
        ))}
      </ul>
      {items.length > initial ? (
        <div>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={expanded}
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
          >
            {expanded ? 'Show less' : `Show all ${items.length}`}
            <ChevronDown
              aria-hidden
              className={cn(
                'size-4 transition-transform duration-150 motion-reduce:transition-none',
                expanded && 'rotate-180'
              )}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
