'use client';

import { useRef, useState } from 'react';

import { useLenis } from '@/components/shell/smooth-scroll';
import { useScenePulse } from '@/components/shell/use-scene-pulse';
import type { FeaturedProject } from '@/data/types';
import { cn } from '@/lib/utils';

import { FeaturedCard } from './featured-card';
import { useStackScroll } from './use-stack-scroll';

/**
 * Featured projects as a scroll-through stack inside a staged `Section`: the section turns green
 * as the rocket reaches it, then each project takes the screen in turn. The numbered row shows
 * which one is in front and scrolls straight to any of them.
 */
export function FeaturedStack({ projects }: { projects: FeaturedProject[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  useScenePulse(ref);
  useStackScroll(ref, setActive);

  const goTo = (index: number) => {
    const section = ref.current?.closest('section');
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY + index * window.innerHeight;
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col gap-4 motion-reduce:flex-none">
      <nav
        aria-label="Selected projects"
        className="relative z-10 flex items-center gap-1 overflow-x-auto motion-reduce:hidden"
      >
        {projects.map((project, i) => (
          <button
            key={project.slug}
            type="button"
            aria-current={i === active ? 'true' : undefined}
            onClick={() => goTo(i)}
            className={cn(
              'flex shrink-0 items-baseline gap-2 rounded-full border px-3 py-1.5 font-ui text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-teal',
              i === active
                ? 'border-teal/60 bg-teal/10 text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <span className="font-mono text-[0.65rem] text-accent-foreground">
              {String(i + 1).padStart(2, '0')}
            </span>
            {project.name}
          </button>
        ))}
        <span className="ml-auto pl-3 font-mono text-xs text-muted-foreground tabular-nums">
          <span className="text-teal">{String(active + 1).padStart(2, '0')}</span> /{' '}
          {String(projects.length).padStart(2, '0')}
        </span>
      </nav>

      <ol className="relative min-h-0 flex-1 motion-reduce:flex motion-reduce:flex-none motion-reduce:flex-col motion-reduce:gap-6">
        {projects.map((project, i) => (
          <li
            key={project.slug}
            data-stack-card
            className="absolute inset-0 origin-top motion-reduce:static motion-reduce:transform-none!"
            // Server markup already shows the first card in front; the stack hook takes over from here.
            style={i > 0 ? { transform: 'translateY(112%)' } : undefined}
          >
            <FeaturedCard
              project={project}
              index={i}
              className="h-full shadow-2xl shadow-black/40"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
