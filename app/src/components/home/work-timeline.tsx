'use client';

import { lazy, type ReactNode } from 'react';

import type { Organization } from '@/data/types';

import { NearWidget } from './near-widget';

const OrgTimeline = lazy(() =>
  import('@/components/experience/org-timeline').then(module => ({ default: module.OrgTimeline }))
);

export function WorkTimeline({ orgs, fallback }: { orgs: Organization[]; fallback: ReactNode }) {
  return (
    <NearWidget fallback={fallback}>
      <OrgTimeline orgs={orgs} />
    </NearWidget>
  );
}
