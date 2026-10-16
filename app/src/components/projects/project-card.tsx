import { Logo } from '@/components/ui/brand-icon';
import type { Project } from '@/data/types';

import { LinkGlyph, SmartLink } from './project-link';

/** Compact list row: logo, name, a one-line summary, and link icons. The whole row opens the first link. */
export function ProjectCard({ project }: { project: Project }) {
  const [primary] = project.links;

  return (
    <div className="group relative flex items-center gap-3 py-3">
      <Logo name={project.name} src={project.icon} size={36} className="size-9" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="flex min-w-0 items-baseline gap-2 text-sm font-semibold tracking-normal text-foreground">
          {primary ? (
            <SmartLink
              href={primary.href}
              className="truncate transition-colors group-hover:text-teal after:absolute after:inset-0"
            >
              {project.name}
            </SmartLink>
          ) : (
            <span className="truncate">{project.name}</span>
          )}
          {project.org ? (
            <span className="hidden shrink-0 truncate font-mono text-xs font-normal text-muted-foreground sm:inline">
              {project.org}
            </span>
          ) : null}
        </h3>
        <p title={project.summary} className="truncate text-xs text-muted-foreground">
          {project.summary}
        </p>
      </div>
      {project.links.length > 0 ? (
        <ul className="relative flex shrink-0 items-center">
          {project.links.map(link => (
            <li key={link.href}>
              <SmartLink
                href={link.href}
                aria-label={`${project.name}: ${link.label}`}
                title={link.label}
                className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
              >
                <LinkGlyph href={link.href} className="size-3.5" />
              </SmartLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
