import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { Explorer, getContents, hrefFor, pathFromSegments } from '@/components/devjourney';

interface DevJourneyPageProps {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: DevJourneyPageProps): Promise<Metadata> {
  const path = pathFromSegments((await params).path);
  return {
    title: path ? `${path} · DevJourney` : 'DevJourney',
    description: path
      ? `${path} in DevJourney, the code I wrote while learning.`
      : 'DevJourney: every piece of code I wrote while learning, browsable on this site.',
    alternates: { canonical: hrefFor(path) },
  };
}

export default async function DevJourneyPage({ params, searchParams }: DevJourneyPageProps) {
  const path = pathFromSegments((await params).path);

  // Links from the previous site used `/devjourney?path=...`.
  const legacy = (await searchParams).path;
  if (!path && typeof legacy === 'string' && legacy)
    redirect(hrefFor(legacy.replace(/^\/+|\/+$/g, '')));

  const contents = await getContents(path);
  if (contents.status === 'missing') notFound();

  return <Explorer path={path} contents={contents} />;
}
