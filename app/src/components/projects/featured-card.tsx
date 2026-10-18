'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { m } from 'motion/react';

import type { FeaturedProject } from '@/data/types';
import { cn } from '@/lib/utils';

import { MetricRow } from './metric-row';
import { ProjectCover } from './project-cover';
import { ProjectLinks } from './project-link';
import { RollingTitle } from './rolling-title';
import { TagChips } from './tag-chips';
import { useFollowPointer } from './use-follow-pointer';

interface FeaturedCardProps {
  project: FeaturedProject;
  index: number;
  className?: string;
}

/** Large "block" card. The cover links to the case study; a teal pill follows the cursor over it. */
export function FeaturedCard({ project, index, className }: FeaturedCardProps) {
  const { x, y, handlers } = useFollowPointer();
  const href = `/projects/${project.slug}`;

  return (
    <article
      className={cn(
        'group relative flex origin-top flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-300 hover:border-line-strong',
        className
      )}
    >
      <Link
        href={href}
        aria-label={`Read the ${project.name} case study`}
        className="group/cover relative block aspect-[16/9] overflow-hidden outline-none md:aspect-auto md:min-h-0 md:flex-1 [&_[data-cover-zoom]]:group-hover:scale-[1.03] [&_[data-cover-zoom]]:group-focus-visible/cover:scale-[1.03]"
        {...handlers}
      >
        <ProjectCover project={project} className="absolute inset-0" />
        <span className="absolute top-4 left-5 font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, '0')} / {project.name}
        </span>
        <m.span
          aria-hidden
          style={{ x, y }}
          className="pointer-events-none absolute top-0 left-0 z-10 [@media(hover:none)]:hidden"
        >
          <span className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-teal px-4 py-2 font-ui text-xs font-semibold whitespace-nowrap text-background shadow-lg shadow-black/40 transition-[clip-path] duration-300 ease-out-expo [clip-path:circle(0%_at_50%_50%)] group-hover/cover:[clip-path:circle(75%_at_50%_50%)] group-focus-visible/cover:[clip-path:circle(75%_at_50%_50%)]">
            View case study
            <ArrowRight className="size-3.5" />
          </span>
        </m.span>
        <span className="pointer-events-none absolute inset-0 rounded-t-xl opacity-0 ring-2 ring-teal ring-inset group-focus-visible/cover:opacity-100" />
      </Link>

      <div className="flex flex-col gap-4 p-5 sm:p-6 md:p-7">
        <p className="label">
          {project.org ? `${project.org} · ` : null}
          {project.role}
        </p>
        <div className="flex flex-col gap-2">
          <RollingTitle
            text={project.name}
            className="text-2xl font-semibold sm:text-3xl md:text-4xl"
          />
          <p className="max-w-prose text-muted-foreground">{project.summary}</p>
        </div>
        <MetricRow metrics={project.metrics} />
        <TagChips items={project.stack} size="xs" />
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <ProjectLinks links={project.links} context={project.name} />
          <Link
            href={href}
            className="group/story ml-auto inline-flex items-center gap-1.5 font-ui text-sm font-medium text-teal"
          >
            Read the story
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out-expo group-hover/story:translate-x-1 group-focus-visible/story:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
