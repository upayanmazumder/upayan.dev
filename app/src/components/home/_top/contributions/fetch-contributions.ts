import * as z from 'zod';

import { statsApi } from '@/api/stats';

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
  const result = await statsApi.get('/api/github/contributions', {
    schema: calendarSchema,
    cache: { revalidate: REVALIDATE_SECONDS },
  });
  return result.ok ? result.data : null;
}
