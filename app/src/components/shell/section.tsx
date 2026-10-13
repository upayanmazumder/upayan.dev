import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Reveal } from './reveal';

interface SectionProps {
  id: string;
  /** Two-digit index shown beside the title, e.g. "03". */
  index?: string;
  title?: string;
  /** One short line under the title. */
  lead?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Home-page section inside the rails. A hairline divider spans the full viewport width.
 * Small teal ticks mark where it crosses the rails.
 */
export function Section({ id, index, title, lead, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('relative scroll-mt-16', className)}>
      <div aria-hidden className="relative h-px w-full bg-line">
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-[calc(var(--column)/2+3px)] -translate-y-1/2 rotate-45 bg-teal/70 max-md:hidden" />
        <span className="absolute top-1/2 left-1/2 size-1.5 translate-x-[calc(var(--column)/2-3px)] -translate-y-1/2 rotate-45 bg-teal/70 max-md:hidden" />
      </div>
      <div className="column py-16 md:py-20">
        {title ? (
          <Reveal as="header" className="mb-10 flex flex-col gap-2">
            <a
              href={`#${id}`}
              className="group/heading inline-flex w-fit items-baseline gap-3 transition-colors hover:text-teal focus-visible:outline-none"
              aria-label={`Jump to ${title} section`}
            >
              {index ? (
                <span className="font-mono text-xs text-teal transition-transform group-hover/heading:-translate-x-0.5">
                  {index}
                </span>
              ) : null}
              <h2
                data-reveal
                className="text-2xl font-semibold transition-colors group-hover/heading:text-teal md:text-3xl"
              >
                {title}
              </h2>
            </a>
            {lead ? (
              <p data-reveal className="max-w-prose text-muted-foreground">
                {lead}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
