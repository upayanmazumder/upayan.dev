import { cache } from 'react';
import * as z from 'zod';

import { statsApi } from '@/api/stats';

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
  const result = await statsApi.get('/devjourney', {
    schema: responseSchema,
    params: { path },
    cache: { revalidate: REVALIDATE_SECONDS },
  });
  if (!result.ok) {
    // The proxy answers 400 for malformed paths and forwards GitHub's 404.
    if (result.reason === 'status' && (result.status === 404 || result.status === 400)) {
      return { status: 'missing' };
    }
    return { status: 'unavailable', reason: result.reason === 'config' ? 'config' : 'upstream' };
  }
  return Array.isArray(result.data)
    ? { status: 'dir', entries: sortEntries(result.data) }
    : { status: 'file', file: result.data };
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
