import { Section } from '@/components/shell/section';

import { LivePanel } from './_top/live/live-panel';

export function LiveNow() {
  return (
    <Section id="now" title="Right now" lead="What I'm listening to and doing, live.">
      <LivePanel />
    </Section>
  );
}
