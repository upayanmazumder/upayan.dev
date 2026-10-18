import { ArrowUpRight } from 'lucide-react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { primarySocials } from '@/data/profile';

import { describeDay, LEVEL_CLASS } from './_top/contributions/calendar';
import { fetchContributions } from './_top/contributions/fetch-contributions';
import { LiveTile, TileUnavailable } from './_top/live/live-tile';
import { ContributionCalendar, ContributionTotal } from './contribution-widgets';

const github = primarySocials.find(social => social.id === 'github');

/** GitHub contributions over the last year, in the same tile frame as the live widgets. */
export async function GitHubTile() {
  const calendar = await fetchContributions();

  return (
    <LiveTile
      label="GitHub"
      icon={<BrandIcon icon="siGithub" name="GitHub" className="size-3.5" />}
      aside={calendar ? 'last 12 months' : null}
    >
      {calendar ? (
        <>
          <p className="text-sm text-muted-foreground">
            <span className="font-ui text-lg font-semibold text-foreground">
              <ContributionTotal value={calendar.total} />
            </span>{' '}
            contributions
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
        </>
      ) : (
        <TileUnavailable what="GitHub" />
      )}
      <div className="flex items-center justify-between gap-2">
        {github ? (
          <a
            href={github.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
          >
            {github.handle ?? 'GitHub'}
            <ArrowUpRight aria-hidden className="size-3" />
          </a>
        ) : null}
        {calendar ? (
          <span aria-hidden className="flex items-center gap-1">
            {LEVEL_CLASS.map(level => (
              <span key={level} className={`size-2 rounded-[2px] ${level}`} />
            ))}
          </span>
        ) : null}
      </div>
    </LiveTile>
  );
}
