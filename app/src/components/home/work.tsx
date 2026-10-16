import { Section } from '@/components/shell/section';
import { work } from '@/data/experience';

import { WorkStatic } from './work-static';
import { WorkTimeline } from './work-timeline';

/** Work experience section displaying employment history and roles. */
export function Work() {
  return (
    <Section id="work" index="09" title="Work">
      <WorkTimeline orgs={work} fallback={<WorkStatic orgs={work} />} />
    </Section>
  );
}
