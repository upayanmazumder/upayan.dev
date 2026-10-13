import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';

import { LiveCards } from './_top/live/live-cards';

export function LiveNow() {
  return (
    <Section id="now" index="02" title="Right now" lead="What I'm listening to and doing, live.">
      <Reveal>
        <LiveCards />
      </Reveal>
    </Section>
  );
}
