import type { CSSProperties } from 'react';

import SpotlightCard from '@/components/rb/SpotlightCard';
import { Logo } from '@/components/ui/brand-icon';
import type { Project } from '@/data/types';

import { LinkGlyph, SmartLink } from './project-link';
import { TagChips } from './tag-chips';

const surface = {
  '--spotlight-card-surface': 'var(--surface)',
  '--spotlight-card-border': 'var(--line)',
  '--spotlight-card-shadow': 'none',
} as CSSProperties;

/** Grid item. The whole card opens the first link; cards without links stay static. */
export function ProjectCard({ project }: { project: Project }) {
  const [primary] = project.links;

  return (
    <SpotlightCard
      spotlightColor="var(--teal)"
      intensity={0.1}
      borderGlow={0.4}
      spotlightSize={220}
      className="group flex h-full flex-col gap-4 rounded-xl p-5"
      style={surface}
    >
      <div className="flex items-start gap-3">
        <Logo name={project.name} src={project.icon} size={40} className="size-10" />
        <div className="flex min-w-0 flex-col">
          <h3 className="font-ui text-[0.9375rem] font-semibold tracking-normal text-foreground">
            {primary ? (
              <SmartLink
                href={primary.href}
                className="outline-none after:absolute after:inset-0 after:z-[2] after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-teal"
              >
                {project.name}
              </SmartLink>
            ) : (
              project.name
            )}
          </h3>
          {project.org ? <p className="text-xs text-muted-foreground">{project.org}</p> : null}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{project.summary}</p>
      <div className="mt-auto flex items-end justify-between gap-3">
        <TagChips items={project.tags} size="xs" label="Tags" />
        {project.links.length > 0 ? (
          <ul className="relative z-[3] flex shrink-0 items-center gap-1">
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
      </div>
    </SpotlightCard>
  );
}
