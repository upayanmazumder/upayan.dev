import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MetricRow } from '@/components/projects/metric-row';
import { NextProject } from '@/components/projects/next-project';
import { ProjectLinks } from '@/components/projects/project-link';
import { TagChips } from '@/components/projects/tag-chips';
import { Logo } from '@/components/ui/brand-icon';
import { featuredProjects } from '@/data/projects';
import { formatPeriod } from '@/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;
// "Present" durations in the period line age daily.
export const revalidate = 86400;

export function generateStaticParams() {
  return featuredProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredProjects.find(p => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.name, description: project.summary, type: 'article' },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = featuredProjects.findIndex(p => p.slug === slug);
  const project = featuredProjects[index];
  if (!project) notFound();
  const next = featuredProjects[(index + 1) % featuredProjects.length]!;
  const { caseStudy } = project;

  const chapters = [
    { title: 'Problem', body: <p>{caseStudy.problem}</p> },
    {
      title: 'What I built',
      body: (
        <ul className="flex list-disc flex-col gap-3 pl-5 marker:text-muted-foreground">
          {caseStudy.built.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ),
    },
    { title: 'Outcome', body: <p>{caseStudy.outcome}</p> },
  ];

  return (
    <article className="column pt-12 pb-24 md:pt-16">
      <Link
        href="/#projects"
        className="group inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft
          aria-hidden
          className="size-4 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5 motion-reduce:transition-none"
        />
        All projects
      </Link>

      <header className="mt-8 flex flex-col gap-4">
        <Logo name={project.name} src={project.image} size={48} className="size-12" />
        <p className="label">
          {project.org ? `${project.org} · ` : null}
          {formatPeriod(project.period.start, project.period.end)}
        </p>
        <h1 className="text-4xl md:text-5xl">{project.name}</h1>
        <p className="max-w-prose text-lg text-muted-foreground">{project.summary}</p>
      </header>

      <div className="mt-10 grid gap-8 border-y border-line py-8 md:grid-cols-[1fr_auto]">
        <MetricRow metrics={project.metrics} size="lg" />
        <div className="flex flex-col gap-1 md:max-w-60">
          <p className="label">Role</p>
          <p className="font-medium text-foreground">{project.role}</p>
        </div>
      </div>

      <div className="divide-y divide-line">
        {chapters.map(chapter => (
          <section
            key={chapter.title}
            className="grid gap-3 py-10 md:grid-cols-[10rem_1fr] md:gap-8"
          >
            <h2 className="text-lg md:text-xl">{chapter.title}</h2>
            <div className="max-w-prose leading-relaxed text-foreground/85">{chapter.body}</div>
          </section>
        ))}
      </div>

      <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="label">Stack</p>
          <TagChips items={project.stack} />
        </div>
        {project.links.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="label">Links</p>
            <ProjectLinks links={project.links} context={project.name} />
          </div>
        ) : null}
      </div>

      {next.slug !== project.slug ? (
        <nav aria-label="More case studies" className="mt-16">
          <NextProject project={next} />
        </nav>
      ) : null}
    </article>
  );
}
