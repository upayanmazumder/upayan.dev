'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { m } from 'motion/react';

import type { FeaturedProject } from '@/data/types';

import { ProjectCover } from './project-cover';
import { RollingTitle } from './rolling-title';
import { useFollowPointer } from './use-follow-pointer';

/** Footer card linking to the next case study. A cover preview follows the cursor on hover. */
export function NextProject({ project }: { project: FeaturedProject }) {
  const { x, y, handlers } = useFollowPointer();

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative block rounded-xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-line-strong md:p-8"
      {...handlers}
    >
      <p className="label">Next project</p>
      <div className="mt-3 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <RollingTitle
            as="p"
            text={project.name}
            className="font-display text-4xl font-semibold tracking-tight md:text-5xl"
          />
          <p className="max-w-md text-sm text-muted-foreground">{project.summary}</p>
        </div>
        <ArrowRight
          aria-hidden
          className="size-6 shrink-0 text-teal transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
        />
      </div>
      <m.span
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none absolute top-0 left-0 z-10 [@media(hover:none)]:hidden"
      >
        <span className="block -translate-x-1/2 -translate-y-[110%] overflow-hidden rounded-lg border border-line-strong shadow-2xl shadow-black/60 transition-[clip-path] duration-500 ease-out-expo [clip-path:inset(50%_50%_50%_50%_round_0.5rem)] group-hover:[clip-path:inset(0_0_0_0_round_0.5rem)]">
          <ProjectCover project={project} size="thumb" className="h-32 w-52" />
        </span>
      </m.span>
    </Link>
  );
}
