import { ExpandableGrid } from '@/components/projects/expandable-grid';
import { ProjectCard } from '@/components/projects/project-card';
import { Section } from '@/components/shell/section';
import { projects } from '@/data/projects';

export function MoreProjects() {
  return (
    <Section id="more" title="More things I built">
      <ExpandableGrid
        initial={6}
        items={projects.map(project => ({
          id: project.slug,
          node: <ProjectCard project={project} />,
        }))}
      />
    </Section>
  );
}
