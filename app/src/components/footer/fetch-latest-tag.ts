import * as z from 'zod';

const releaseSchema = z.object({ tag_name: z.string().min(1) });
const RELEASE_URL = 'https://api.github.com/repos/upayanmazumder/upayan.dev/releases/latest';

export async function fetchLatestTag(fetchImpl: typeof fetch = fetch): Promise<string | null> {
  try {
    const response = await fetchImpl(RELEASE_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const release = releaseSchema.safeParse(await response.json());
    return release.success ? release.data.tag_name : null;
  } catch {
    return null;
  }
}
