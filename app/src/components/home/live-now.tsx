import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';

import { LivePanel } from './_top/live/live-panel';

export function LiveNow() {
  return (
    <Section
      id="now"
      index="02"
      title="Right now"
      lead="What I'm listening to and doing, live."
      // The panel's outer glow reaches past the gutter on phones.
      className="overflow-x-clip"
    >
      <Reveal>
        <LivePanel />
      </Reveal>
    </Section>
  );
}
