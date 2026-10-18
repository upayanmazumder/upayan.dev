import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials } from '@/data/profile';

import { describeDay, LEVEL_CLASS } from './_top/contributions/calendar';
import { fetchContributions } from './_top/contributions/fetch-contributions';
import { ContributionCalendar, ContributionTotal } from './contribution-widgets';

const github = primarySocials.find(social => social.id === 'github');

/** Link to the profile owner's GitHub profile. */
function ProfileLink() {
  if (!github) return null;
  return (
    <a
      href={github.href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-ui text-xs text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
    >
      <BrandIcon icon={github.icon} name={github.label} className="size-3.5" />
      {github.handle ?? 'GitHub'}
      <ArrowUpRight aria-hidden className="size-3" />
    </a>
  );
}

/** Section displaying recent GitHub contribution counts and activity calendar. */
export async function Contributions() {
  const calendar = await fetchContributions();

  return (
    <Section id="activity" index="03" title="GitHub activity">
      {calendar ? (
        <div className="flex flex-col gap-5">
          <Reveal>
            <p className="text-muted-foreground">
              <ContributionTotal value={calendar.total} /> contributions in the last year
            </p>
          </Reveal>
          <ContributionCalendar weeks={calendar.weeks} />
          <noscript className="hidden [@media(scripting:none)]:block">
            <details>
              <summary>Daily contributions</summary>
              <p>
                {calendar.weeks
                  .flatMap(week => week.days)
                  .map(describeDay)
                  .join('; ')}
              </p>
            </details>
          </noscript>
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
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong p-6">
          <p className="font-ui text-sm text-foreground">Activity is unavailable right now.</p>
          <p className="text-sm text-muted-foreground">
            The contribution calendar could not be loaded. It is still on GitHub.
          </p>
          <ProfileLink />
        </div>
      )}
    </Section>
  );
}
