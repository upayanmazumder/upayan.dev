'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, m } from 'motion/react';

import type { FeaturedProject } from '@/data/types';
import { cn } from '@/lib/utils';

import { FeaturedCard } from './featured-card';

/**
 * One featured project at a time behind a row of tabs, so the whole section fits one screen and
 * the roadmap trail beside it stays readable. Arrow keys move between tabs; the active underline
 * slides between them and the card crossfades.
 */
export function FeaturedSwitcher({ projects }: { projects: FeaturedProject[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const project = projects[active];
  if (!project) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (active + step + projects.length) % projects.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Selected projects"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-line"
      >
        {projects.map((item, i) => (
          <button
            key={item.slug}
            ref={el => {
              tabs.current[i] = el;
            }}
            id={`${id}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              'relative flex shrink-0 items-baseline gap-2 px-3 py-2.5 font-ui text-sm transition-colors focus-visible:text-teal focus-visible:outline-none',
              i === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="font-mono text-[0.65rem] text-accent-foreground">
              {String(i + 1).padStart(2, '0')}
            </span>
            {item.name}
            {i === active ? (
              <m.span
                layoutId={`${id}-underline`}
                className="absolute inset-x-2 -bottom-px h-px bg-teal shadow-[0_0_8px_var(--teal)]"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            ) : null}
          </button>
        ))}
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        className="md:h-[min(34rem,calc(90svh-15rem))]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={project.slug}
            className="h-full"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <FeaturedCard project={project} index={active} className="h-full" />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
