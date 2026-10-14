import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

function toDate(date: Date | string): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

export function formatDate(date: Date | string, fmt = 'PPP'): string {
  const d = toDate(date);
  return isValid(d) ? format(d, fmt) : '';
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'PPP p');
}

export function formatRelativeDate(date: Date | string, baseDate: Date = new Date()): string {
  const d = toDate(date);
  return isValid(d) ? formatRelative(d, baseDate) : '';
}

export function timeAgo(date: Date | string): string {
  const d = toDate(date);
  return isValid(d) ? formatDistance(d, new Date(), { addSuffix: true }) : '';
}

/** "Mar 2026" from a `YYYY-MM` month string. */
export function formatMonth(month: string): string {
  return formatDate(`${month}-01`, 'MMM yyyy');
}

/**
 * "Feb 2025 – Present · 1 yr 8 mos". Counts both endpoint months, like LinkedIn.
 * `now` is injectable for deterministic tests.
 */
export function formatPeriod(start: string, end: string | null, now: Date = new Date()): string {
  const [sy, sm] = start.split('-').map(Number) as [number, number];
  const [ey, em] = end
    ? (end.split('-').map(Number) as [number, number])
    : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '',
    rest > 0 ? `${rest} mo${rest > 1 ? 's' : ''}` : '',
  ].filter(Boolean);
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'} · ${parts.join(' ')}`;
}
