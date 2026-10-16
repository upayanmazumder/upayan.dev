import { Section } from '@/components/shell/section';

import { LivePanel } from './_top/live/live-panel';

export function LiveNow() {
  return (
    <Section
      id="now"
      index="02"
      title="Right now"
      lead="Live status from Spotify, Discord, my machine, and my editor."
      // The panel's outer glow reaches past the gutter on phones.
      className="overflow-x-clip"
    >
      <LivePanel />
    </Section>
  );
}
