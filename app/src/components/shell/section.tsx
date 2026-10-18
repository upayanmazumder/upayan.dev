import type { ReactNode } from 'react';

import { trailSide } from '@/components/nav/sections';
import { cn } from '@/lib/utils';

import { MarginTile } from './margin-tile';
import { Reveal } from './reveal';

export interface SectionAside {
  /** Short mono caption above the tile. */
  caption: string;
  content: ReactNode;
}

interface SectionProps {
  id: string;
  /** Two-digit index shown beside the title, e.g. "03". */
  index?: string;
  title?: string;
  /** One short line under the title. */
  lead?: string;
  /** Widget for the margin opposite the trail. */
  aside?: SectionAside;
  className?: string;
  children: ReactNode;
}

/**
 * Home-page section on the roadmap trail. From `lg` the title turns 90° counter-clockwise and sits
 * in the trail's margin, between the screen edge and the line; the trail marks the section in view
 * with `data-current`, which lights the title up. Below `lg` it is an ordinary heading. An optional
 * aside fills the other margin.
 */
export function Section({ id, index, title, lead, aside, className, children }: SectionProps) {
  const side = trailSide(id);

  return (
    <section
      id={id}
      data-trail-side={side}
      className={cn('group/section relative scroll-mt-16', className)}
    >
      <div className="column relative py-14 md:py-20 lg:py-16">
        {title ? (
          <Reveal
            as="header"
            className={cn('mb-8 flex flex-col gap-2 md:mb-10', !lead && 'lg:mb-0')}
          >
            <a
              href={`#${id}`}
              aria-label={`Jump to ${title} section`}
              className={cn(
                'group/heading inline-flex w-fit items-baseline gap-3 transition-colors hover:text-teal focus-visible:outline-none',
                'lg:absolute lg:top-16 lg:rotate-180 lg:items-center lg:[writing-mode:vertical-rl]',
                side === 'left'
                  ? 'lg:left-[calc((var(--column)-100vw)/4-22px)] lg:-translate-x-1/2'
                  : 'lg:right-[calc((var(--column)-100vw)/4-22px)] lg:translate-x-1/2'
              )}
            >
              {index ? (
                <span className="font-mono text-xs text-accent-foreground transition-colors duration-500 group-hover/heading:-translate-x-0.5 lg:text-muted-foreground lg:group-hover/heading:translate-x-0 lg:group-data-[current=true]/section:text-teal">
                  {index}
                </span>
              ) : null}
              <h2
                data-reveal
                className="text-2xl font-semibold transition-colors duration-500 group-hover/heading:text-teal md:text-3xl lg:tracking-wide lg:whitespace-nowrap lg:text-foreground/35 lg:group-data-[current=true]/section:text-foreground"
              >
                {title}
              </h2>
              <span
                aria-hidden
                className="hidden h-16 w-px origin-top scale-y-0 bg-linear-to-b from-teal to-transparent transition-transform duration-700 ease-out-expo lg:block lg:group-data-[current=true]/section:scale-y-100"
              />
            </a>
            {lead ? (
              <p data-reveal className="max-w-prose text-muted-foreground">
                {lead}
              </p>
            ) : null}
          </Reveal>
        ) : null}
        {children}
        {aside ? (
          <MarginTile side={side === 'left' ? 'right' : 'left'} caption={aside.caption}>
            {aside.content}
          </MarginTile>
        ) : null}
      </div>
    </section>
  );
}
