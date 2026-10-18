import { FeaturedStack } from '@/components/projects/featured-stack';
import { Section } from '@/components/shell/section';
import { featuredProjects } from '@/data/projects';

export function FeaturedProjects() {
  return (
    <Section
      id="projects"
      index="05"
      title="Selected work"
      lead="Three projects I am most proud of."
    >
      <FeaturedStack projects={featuredProjects} />
    </Section>
  );
}
