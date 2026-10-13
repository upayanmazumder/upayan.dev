import { cache } from 'react';
import * as z from 'zod';

import { env } from '@/env';

const entrySchema = z.object({
  name: z.string(),
  path: z.string(),
  sha: z.string(),
  size: z.number(),
  type: z.enum(['file', 'dir', 'symlink', 'submodule']),
  html_url: z.string().nullable(),
  download_url: z.string().nullable(),
});

const fileSchema = entrySchema.extend({
  content: z.string().optional(),
  encoding: z.string().optional(),
});

const responseSchema = z.union([z.array(entrySchema), fileSchema]);

export type RepoEntry = z.infer<typeof entrySchema>;
export type RepoFile = z.infer<typeof fileSchema>;

export type Contents =
  | { status: 'unavailable'; reason: 'config' | 'upstream' }
  | { status: 'missing' }
  | { status: 'dir'; entries: RepoEntry[] }
  | { status: 'file'; file: RepoFile };

const REVALIDATE_SECONDS = 3600;

/** Reads a repo path through the Rust DevJourney proxy. Cached per request and revalidated hourly. */
export const getContents = cache(async (path: string): Promise<Contents> => {
  if (!env.API_URL) return { status: 'unavailable', reason: 'config' };

  const url = new URL(`${env.API_URL.replace(/\/+$/, '')}/devjourney`);
  if (path) url.searchParams.set('path', path);

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  } catch {
    return { status: 'unavailable', reason: 'upstream' };
  }

  // The proxy answers 400 for malformed paths and forwards GitHub's 404.
  if (response.status === 404 || response.status === 400) return { status: 'missing' };
  if (!response.ok) return { status: 'unavailable', reason: 'upstream' };

  const parsed = responseSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) return { status: 'unavailable', reason: 'upstream' };

  return Array.isArray(parsed.data)
    ? { status: 'dir', entries: sortEntries(parsed.data) }
    : { status: 'file', file: parsed.data };
});

function sortEntries(entries: RepoEntry[]): RepoEntry[] {
  return [...entries].sort((a, b) => {
    const aDir = a.type === 'dir' ? 0 : 1;
    const bDir = b.type === 'dir' ? 0 : 1;
    return (
      aDir - bDir || a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );
  });
}
