import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { Reveal } from './reveal';

interface MarginSectionProps {
  id: string;
  /** Two-digit index shown beside the title, e.g. "03". */
  index?: string;
  title: string;
  /** One short line under the title. */
  lead?: string;
  /** Margin the section moves into once the page is wide enough. */
  side: 'left' | 'right';
  className?: string;
  children: ReactNode;
}

/**
 * Section that leaves the centre column on wide screens and parks in a page margin, beside the
 * content that follows it. It keeps its id and document order, so anchors and reading order are
 * unchanged; only the box moves. Below 87.5rem there is no room for a lane plus a card, so it reads
 * as a normal centred section. Inside, lay out against the `@container` wrapper, never the viewport.
 */
export function MarginSection({
  id,
  index,
  title,
  lead,
  side,
  className,
  children,
}: MarginSectionProps) {
  return (
    <section
      id={id}
      data-margin={side}
      className={cn(
        'relative scroll-mt-16 min-[87.5rem]:absolute min-[87.5rem]:w-[calc((100vw-var(--column))/2-5.5rem)]',
        side === 'left' ? 'min-[87.5rem]:left-6' : 'min-[87.5rem]:right-6',
        className
      )}
    >
      <div aria-hidden className="relative h-px w-full bg-line min-[87.5rem]:hidden">
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-[calc(var(--column)/2+3px)] -translate-y-1/2 rotate-45 bg-teal/70 max-[50rem]:hidden" />
        <span className="absolute top-1/2 left-1/2 size-1.5 translate-x-[calc(var(--column)/2-3px)] -translate-y-1/2 rotate-45 bg-teal/70 max-[50rem]:hidden" />
      </div>
      <div className="column @container py-14 md:py-20 min-[87.5rem]:max-w-none min-[87.5rem]:px-0 min-[87.5rem]:py-10">
        <Reveal as="header" className="mb-5 flex flex-col gap-2 @xl:mb-10">
          <a
            href={`#${id}`}
            className="group/heading inline-flex w-fit items-baseline gap-3 transition-colors hover:text-teal focus-visible:outline-none"
            aria-label={`Jump to ${title} section`}
          >
            {index ? (
              <span className="font-mono text-xs text-accent-foreground transition-transform group-hover/heading:-translate-x-0.5">
                {index}
              </span>
            ) : null}
            <h2
              data-reveal
              className="text-lg font-semibold transition-colors group-hover/heading:text-teal @md:text-2xl @xl:text-3xl"
            >
              {title}
            </h2>
          </a>
          {lead ? (
            <p data-reveal className="max-w-prose text-sm text-muted-foreground @xl:text-base">
              {lead}
            </p>
          ) : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
