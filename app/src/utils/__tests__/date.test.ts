import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime, timeAgo } from '../date';

describe('formatDate', () => {
  it('formats a Date object', () => {
    expect(formatDate(new Date(2024, 5, 15), 'yyyy-MM-dd')).toBe('2024-06-15');
  });

  it('formats a date-only ISO string', () => {
    expect(formatDate('2024-06-15', 'yyyy-MM-dd')).toBe('2024-06-15');
  });

  it('returns empty string for an invalid date', () => {
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('formatDateTime', () => {
  it('returns a non-empty string for a valid date', () => {
    expect(formatDateTime(new Date(2024, 5, 15, 12, 0, 0))).not.toBe('');
  });

  it('returns empty string for an invalid date', () => {
    expect(formatDateTime('bad')).toBe('');
  });
});

describe('timeAgo', () => {
  it('returns a relative time string with "ago"', () => {
    const past = new Date(Date.now() - 5 * 60_000);
    expect(timeAgo(past)).toMatch(/ago/);
  });

  it('returns empty string for an invalid date', () => {
    expect(timeAgo('invalid')).toBe('');
  });
});
