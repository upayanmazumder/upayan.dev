import { ExpandableGrid } from '@/components/projects/expandable-grid';
import { ProjectCard } from '@/components/projects/project-card';
import { Section, type SectionAside } from '@/components/shell/section';
import { projects } from '@/data/projects';

export function MoreProjects({ aside }: { aside?: SectionAside }) {
  return (
    <Section id="more" index="05" title="More builds" aside={aside}>
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
