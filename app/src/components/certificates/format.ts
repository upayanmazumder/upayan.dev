const formatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2025-04-24" → "24 Apr 2025". */
export const formatCertDate = (date: string) => formatter.format(new Date(`${date}T00:00:00Z`));
