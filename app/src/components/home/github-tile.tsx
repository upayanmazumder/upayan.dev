import { ArrowUpRight } from 'lucide-react';

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

/** GitHub contribution total and calendar, sized for a margin tile. The calendar fits its width. */
export async function GitHubTile() {
  const calendar = await fetchContributions();

  if (!calendar) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong p-4">
        <p className="font-ui text-sm text-foreground">Activity is unavailable right now.</p>
        <ProfileLink />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface/60 p-4">
      <p className="text-sm text-muted-foreground">
        <ContributionTotal value={calendar.total} /> contributions this year
      </p>
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ProfileLink />
        <div className="flex items-center gap-1 font-mono text-[0.625rem] text-muted-foreground">
          {LEVEL_CLASS.map(level => (
            <span key={level} aria-hidden className={`size-2 rounded-[2px] ${level}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
