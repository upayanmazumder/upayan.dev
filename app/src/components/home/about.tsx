import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';

// Figures like "134K+" or "30K+" carry the point of each line, so they render in full foreground weight.
const FIGURE = /(\d[\d.,]*[KMB]?\+)/;

export function About() {
  return (
    <Section id="about" title="About">
      <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed text-muted-foreground">
        {profile.about.map(line => (
          <p key={line}>
            {line.split(FIGURE).map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-medium text-foreground tabular-nums">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        ))}
      </div>
    </Section>
  );
}
