import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';

import { ScrubWords } from './_top/scrub-words';

// Figures like "134K+" or "30K+" carry the point of each line, so they render in full foreground weight.
const FIGURE = /(\d[\d.,]*[KMB]?\+)/;

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <ScrubWords className="flex max-w-prose flex-col gap-5 text-lg leading-relaxed text-foreground/85 md:text-xl">
        {profile.about.map(line => (
          <p key={line}>
            {line.split(FIGURE).map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-mono font-semibold text-foreground">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        ))}
      </ScrubWords>
    </Section>
  );
}
