import { FeaturedItem } from '@/components/projects/featured-item';
import { Section } from '@/components/shell/section';
import { featuredProjects } from '@/data/projects';

export function FeaturedProjects() {
  return (
    <Section id="projects" title="Selected work" lead="Three projects I’m proudest of.">
      <ul className="divide-y divide-line">
        {featuredProjects.map(project => (
          <li key={project.slug} className="py-10 first:pt-0 last:pb-0">
            <FeaturedItem project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
