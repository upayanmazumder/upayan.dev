import { OrgTimeline } from '@/components/experience/org-timeline';
import { Section, type SectionAside } from '@/components/shell/section';
import { communities } from '@/data/experience';

export function Communities({ aside }: { aside?: SectionAside }) {
  return (
    <Section
      id="communities"
      index="07"
      aside={aside}
      title="Communities"
      lead="Technical chapters I help run at college."
    >
      <OrgTimeline orgs={communities} className="lg:grid lg:grid-cols-2 lg:gap-x-10" />
    </Section>
  );
}
