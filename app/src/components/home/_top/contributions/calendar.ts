export interface Day {
  date: string;
  count: number;
  level: number;
}

/** Fill per contribution level 0–4. */
export const LEVEL_CLASS = [
  'bg-surface-2',
  'bg-teal/25',
  'bg-teal/45',
  'bg-teal/70',
  'bg-teal',
] as const;

export interface CalendarLayout {
  /** `weeks × 7` slots, Sunday first. `null` where a partial week has no day. */
  slots: (Day | null)[];
  weekCount: number;
  /** Month name and the week column where it starts. */
  months: { label: string; week: number }[];
}

const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);

// Labels closer than this many columns would overlap at 13 px per column.
const MIN_LABEL_GAP = 3;

export function layoutCalendar(weeks: { days: Day[] }[]): CalendarLayout {
  const slots: (Day | null)[] = [];
  const months: CalendarLayout['months'] = [];
  let lastMonth = -1;

  weeks.forEach((week, w) => {
    const column: (Day | null)[] = Array.from({ length: 7 }, () => null);
    for (const day of week.days) column[toDate(day.date).getUTCDay()] = day;
    slots.push(...column);

    const first = week.days[0];
    if (!first) return;
    const date = toDate(first.date);
    const month = date.getUTCMonth();
    if (month === lastMonth) return;
    lastMonth = month;
    const previous = months.at(-1);
    if (previous && w - previous.week < MIN_LABEL_GAP) months.pop();
    months.push({ label: monthFormat.format(date), week: w });
  });

  return { slots, weekCount: weeks.length, months };
}

/** "3 contributions on Mon, 12 Oct". */
export function describeDay(day: Day): string {
  const parts = Object.fromEntries(
    dayFormat.formatToParts(toDate(day.date)).map(p => [p.type, p.value])
  );
  const when = `${parts.weekday}, ${parts.day} ${parts.month}`;
  if (day.count === 0) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? '' : 's'} on ${when}`;
}
