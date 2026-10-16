import { ArrowUpRight } from 'lucide-react';

import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials } from '@/data/profile';

import { LEVEL_CLASS } from './_top/contributions/calendar';
import { fetchContributions } from './_top/contributions/fetch-contributions';
import { Heatmap } from './_top/contributions/heatmap';
import { Total } from './_top/contributions/total';

const github = primarySocials.find(social => social.id === 'github');

function ProfileLink() {
  if (!github) return null;
  return (
    <a
      href={github.href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
    >
      <BrandIcon icon={github.icon} name={github.label} className="size-3.5" />
      {github.handle ?? 'GitHub'}
      <ArrowUpRight
        aria-hidden
        className="size-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      />
    </a>
  );
}

export async function Contributions() {
  const calendar = await fetchContributions();

  return (
    <Section id="activity" title="GitHub activity">
      {calendar ? (
        <div className="flex flex-col gap-5">
          <p className="text-muted-foreground">
            <Total value={calendar.total} /> contributions in the last year
          </p>
          <Heatmap weeks={calendar.weeks} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ProfileLink />
            <div className="flex items-center gap-1.5 font-mono text-[0.625rem] text-muted-foreground">
              <span>Less</span>
              {LEVEL_CLASS.map(level => (
                <span key={level} aria-hidden className={`size-2.5 rounded-[2px] ${level}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-line bg-surface p-6">
          <p className="text-sm text-foreground">Activity is unavailable right now.</p>
          <p className="text-sm text-muted-foreground">
            The contribution calendar could not be loaded. It is still on GitHub.
          </p>
          <ProfileLink />
        </div>
      )}
    </Section>
  );
}
