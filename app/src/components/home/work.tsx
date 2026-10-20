import { Section, type SectionAside } from '@/components/shell/section';
import { work } from '@/data/experience';

import { WorkStatic } from './work-static';
import { WorkTimeline } from './work-timeline';

/** Work experience section displaying employment history and roles. */
export function Work({ aside }: { aside?: SectionAside }) {
  return (
    <Section id="work" index="06" title="Work" aside={aside}>
      <WorkTimeline orgs={work} fallback={<WorkStatic orgs={work} />} />
    </Section>
  );
}
