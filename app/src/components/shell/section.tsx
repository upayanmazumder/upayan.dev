import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  title?: string;
  /** One short line under the title. */
  lead?: string;
  className?: string;
  children: ReactNode;
}

/** Home-page section: a hairline rule, a plain heading, and the content column. */
export function Section({ id, title, lead, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn('border-t border-line', className)}
    >
      <div className="column py-16 md:py-20">
        {title ? (
          <header className="mb-8 flex flex-col gap-1.5 md:mb-10">
            <h2 id={`${id}-title`} className="text-xl md:text-2xl">
              {title}
            </h2>
            {lead ? <p className="max-w-prose text-muted-foreground">{lead}</p> : null}
          </header>
        ) : null}
        {children}
      </div>
    </section>
  );
}
