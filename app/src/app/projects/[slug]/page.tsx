import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { CaseTitle } from '@/components/projects/case-title';
import { MetricRow } from '@/components/projects/metric-row';
import { NextProject } from '@/components/projects/next-project';
import { ProjectCover } from '@/components/projects/project-cover';
import { ProjectLinks } from '@/components/projects/project-link';
import { TagChips } from '@/components/projects/tag-chips';
import { Reveal } from '@/components/shell/reveal';
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
        <ul className="flex flex-col gap-3">
          {caseStudy.built.map(item => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-teal/80" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ),
    },
    { title: 'Outcome', body: <p>{caseStudy.outcome}</p> },
  ];

  return (
    <article className="column pt-28 pb-24 md:pt-36">
      <Link
        href="/#projects"
        className="group inline-flex items-center gap-2 font-ui text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft
          aria-hidden
          className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
        />
        All projects
      </Link>

      <header className="mt-10 flex flex-col gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          {project.org ? <span className="text-teal">{project.org}</span> : null}
          {project.org ? ' · ' : null}
          {formatPeriod(project.period.start, project.period.end)}
        </p>
        <CaseTitle text={project.name} className="text-4xl font-semibold md:text-6xl" />
        <p className="max-w-prose text-lg text-muted-foreground md:text-xl">{project.summary}</p>
      </header>

      <Reveal className="mt-10">
        <ProjectCover
          project={project}
          size="hero"
          priority
          className="aspect-[16/9] rounded-xl border border-line"
        />
      </Reveal>

      <Reveal className="mt-12 grid gap-10 border-y border-line py-10 md:grid-cols-[1fr_auto]">
        {project.metrics.length > 0 ? (
          <div data-reveal>
            <MetricRow metrics={project.metrics} size="lg" />
          </div>
        ) : null}
        <div data-reveal className="flex flex-col gap-2 md:max-w-60">
          <p className="label">Role</p>
          <p className="font-ui text-base font-medium text-foreground">{project.role}</p>
        </div>
      </Reveal>

      <ol className="mt-4">
        {chapters.map((chapter, i) => (
          <li key={chapter.title} className="border-b border-line py-12">
            <Reveal className="grid gap-4 md:grid-cols-[8rem_1fr] md:gap-8">
              <div data-reveal className="flex items-baseline gap-3 md:flex-col md:gap-2">
                <span className="font-mono text-xs text-teal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl font-semibold md:text-2xl">{chapter.title}</h2>
              </div>
              <div
                data-reveal
                className="max-w-prose text-base leading-relaxed text-foreground/85 md:text-lg"
              >
                {chapter.body}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-12 grid gap-8 md:grid-cols-2">
        <div data-reveal className="flex flex-col gap-3">
          <p className="label">Stack</p>
          <TagChips items={project.stack} />
        </div>
        {project.links.length > 0 ? (
          <div data-reveal className="flex flex-col gap-3">
            <p className="label">Links</p>
            <ProjectLinks links={project.links} context={project.name} />
          </div>
        ) : null}
      </Reveal>

      {next.slug !== project.slug ? (
        <Reveal className="mt-20">
          <NextProject project={next} />
        </Reveal>
      ) : null}
    </article>
  );
}
