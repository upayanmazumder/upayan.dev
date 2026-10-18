import { FeaturedSwitcher } from '@/components/projects/featured-switcher';
import { Section, type SectionAside } from '@/components/shell/section';
import { featuredProjects } from '@/data/projects';

export function FeaturedProjects({ aside }: { aside?: SectionAside }) {
  return (
    <Section
      id="projects"
      index="03"
      aside={aside}
      title="Selected work"
      lead="Three projects I am most proud of."
    >
      <FeaturedSwitcher projects={featuredProjects} />
    </Section>
  );
}
