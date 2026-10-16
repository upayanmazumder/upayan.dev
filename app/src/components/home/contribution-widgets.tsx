'use client';

import { lazy } from 'react';

import type { Day } from './_top/contributions/calendar';
import { NearWidget } from './near-widget';

const Heatmap = lazy(() =>
  import('./_top/contributions/heatmap').then(module => ({ default: module.Heatmap }))
);
const Total = lazy(() =>
  import('./_top/contributions/total').then(module => ({ default: module.Total }))
);

/** Deferred contribution calendar heatmap loaded near the viewport. */
export function ContributionCalendar({ weeks }: { weeks: { days: Day[] }[] }) {
  return (
    <NearWidget
      className="min-h-[129px]"
      fallback={
        <div
          role="img"
          aria-label="Contribution calendar. Daily activity is available on GitHub."
          className="h-[129px] rounded-md border border-line bg-surface-2/40"
        />
      }
    >
      <Heatmap weeks={weeks} />
    </NearWidget>
  );
}

/** Deferred animated counter for total contributions loaded near the viewport. */
export function ContributionTotal({ value }: { value: number }) {
  return (
    <NearWidget
      as="span"
      className="inline-block align-baseline whitespace-nowrap"
      fallback={
        <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
          {value.toLocaleString('en-US')}
        </span>
      }
    >
      <Total value={value} />
    </NearWidget>
  );
}
