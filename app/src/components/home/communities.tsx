import { OrgTimeline } from '@/components/experience/org-timeline';
import { Section } from '@/components/shell/section';
import { communities } from '@/data/experience';

export function Communities() {
  return (
    <Section
      id="communities"
      index="09"
      title="Communities"
      lead="Technical chapters I help run at college."
    >
      <OrgTimeline orgs={communities} />
    </Section>
  );
}
