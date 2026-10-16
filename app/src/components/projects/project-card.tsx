import type { CSSProperties } from 'react';

import SpotlightCard from '@/components/rb/SpotlightCard';
import { Logo } from '@/components/ui/brand-icon';
import type { Project } from '@/data/types';

import { LinkGlyph, SmartLink } from './project-link';

const surface = {
  '--spotlight-card-surface': 'var(--surface)',
  '--spotlight-card-border': 'var(--line)',
  '--spotlight-card-shadow': 'none',
} as CSSProperties;

/** Compact grid item: logo, name, a one-line summary, and link icons. The whole card opens the first link. */
export function ProjectCard({ project }: { project: Project }) {
  const [primary] = project.links;

  return (
    <SpotlightCard
      spotlightColor="var(--teal)"
      intensity={0.07}
      borderGlow={0.3}
      spotlightSize={180}
      className="group flex h-full items-center gap-3 rounded-xl px-3.5 py-3"
      style={surface}
    >
      <Logo name={project.name} src={project.icon} size={36} className="size-9" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="flex min-w-0 items-baseline gap-2 font-ui text-sm font-semibold tracking-normal text-foreground">
          {primary ? (
            <SmartLink
              href={primary.href}
              className="truncate outline-none after:absolute after:inset-0 after:z-[2] after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-teal"
            >
              {project.name}
            </SmartLink>
          ) : (
            <span className="truncate">{project.name}</span>
          )}
          {project.org ? (
            <span className="hidden shrink-0 truncate text-[0.6875rem] font-normal text-muted-foreground sm:inline">
              {project.org}
            </span>
          ) : null}
        </h3>
        <p title={project.summary} className="truncate text-xs text-muted-foreground">
          {project.summary}
        </p>
      </div>
      {project.links.length > 0 ? (
        <ul className="relative z-[3] flex shrink-0 items-center">
          {project.links.map(link => (
            <li key={link.href}>
              <SmartLink
                href={link.href}
                aria-label={`${project.name}: ${link.label}`}
                title={link.label}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-teal focus-visible:text-teal"
              >
                <LinkGlyph href={link.href} className="size-3.5" />
              </SmartLink>
            </li>
          ))}
        </ul>
      ) : null}
    </SpotlightCard>
  );
}
