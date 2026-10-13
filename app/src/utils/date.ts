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
