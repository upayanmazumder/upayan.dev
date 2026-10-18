import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MarginAsideProps {
  /** Margin the card moves into once the page is wide enough. */
  side: 'left' | 'right';
  className?: string;
  children: ReactNode;
}

/**
 * A card that fills otherwise empty page margin. On wide screens it leaves the flow and parks in a
 * margin beside the section that follows it; below 87.5rem there is no margin to use, so it reads as
 * a block in the column. It carries no id: it is page furniture, not a section the nav links to.
 * Lay children out against the `@container` wrapper, never the viewport.
 */
export function MarginAside({ side, className, children }: MarginAsideProps) {
  return (
    <aside
      data-margin={side}
      className={cn(
        'relative min-[87.5rem]:absolute min-[87.5rem]:w-[calc((100vw-var(--column))/2-5.5rem)]',
        side === 'left' ? 'min-[87.5rem]:left-6' : 'min-[87.5rem]:right-6',
        className
      )}
    >
      <div className="column @container py-6 min-[87.5rem]:max-w-none min-[87.5rem]:px-0 min-[87.5rem]:py-0">
        {children}
      </div>
    </aside>
  );
}
