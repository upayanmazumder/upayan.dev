import { FeaturedStack } from '@/components/projects/featured-stack';
import { SceneBackdrop } from '@/components/shell/scene-backdrop';
import { Section } from '@/components/shell/section';
import { featuredProjects } from '@/data/projects';

export function FeaturedProjects() {
  return (
    <Section
      id="projects"
      index="03"
      title="Selected work"
      lead="Three projects I am most proud of."
      stage={featuredProjects.length}
      backdrop={<SceneBackdrop />}
    >
      <FeaturedStack projects={featuredProjects} />
    </Section>
  );
}
