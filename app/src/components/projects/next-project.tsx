import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { FeaturedProject } from '@/data/types';

/** Plain link to the next case study. */
export function NextProject({ project }: { project: FeaturedProject }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-end justify-between gap-6 border-t border-line pt-8"
    >
      <span className="flex flex-col gap-2">
        <span className="label">Next project</span>
        <span className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-teal md:text-3xl">
          {project.name}
        </span>
        <span className="max-w-md text-sm text-muted-foreground">{project.summary}</span>
      </span>
      <ArrowRight
        aria-hidden
        className="size-5 shrink-0 text-muted-foreground transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-teal group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}
