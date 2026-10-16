import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Logo } from '@/components/ui/brand-icon';
import type { FeaturedProject } from '@/data/types';

import { MetricRow } from './metric-row';
import { ProjectLinks } from './project-link';
import { TagChips } from './tag-chips';

/** One selected-work entry: meta, name, pitch, numbers, stack, and links. */
export function FeaturedItem({ project }: { project: FeaturedProject }) {
  const href = `/projects/${project.slug}`;

  return (
    <article className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <Logo name={project.name} src={project.image} size={40} className="size-10" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="label">
            {project.org ? `${project.org} · ` : null}
            {project.role}
          </p>
          <h3 className="text-xl md:text-2xl">
            <Link href={href} className="transition-colors hover:text-teal">
              {project.name}
            </Link>
          </h3>
        </div>
      </div>
      <p className="max-w-prose text-muted-foreground">{project.summary}</p>
      <MetricRow metrics={project.metrics} />
      <TagChips items={project.stack} size="xs" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProjectLinks links={project.links} context={project.name} />
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-teal"
        >
          Read the case study<span className="sr-only">: {project.name}</span>
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </article>
  );
}
