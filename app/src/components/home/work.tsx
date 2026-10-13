import { OrgTimeline } from '@/components/experience/org-timeline';
import { Section } from '@/components/shell/section';
import { work } from '@/data/experience';

export function Work() {
  return (
    <Section id="work" index="08" title="Work">
      <OrgTimeline orgs={work} />
    </Section>
  );
}
