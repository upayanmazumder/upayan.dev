import * as z from 'zod';

import { env } from '@/env';

const REVALIDATE_SECONDS = 21_600;

const calendarSchema = z.object({
  user: z.string(),
  total: z.number().int().nonnegative(),
  weeks: z.array(
    z.object({
      days: z.array(
        z.object({
          date: z.iso.date(),
          count: z.number().int().nonnegative(),
          level: z.number().int().min(0).max(4),
        })
      ),
    })
  ),
  fetched_at: z.string(),
});

export type ContributionCalendar = z.infer<typeof calendarSchema>;

/** Year of GitHub contributions from the Rust API, cached for 6 h. `null` when unconfigured or failing. */
export async function fetchContributions(): Promise<ContributionCalendar | null> {
  if (!env.API_URL) return null;
  try {
    const response = await fetch(new URL('/api/github/contributions', env.API_URL), {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const parsed = calendarSchema.safeParse(await response.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
