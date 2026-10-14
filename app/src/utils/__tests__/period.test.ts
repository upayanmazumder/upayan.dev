import { describe, expect, it } from 'vitest';

import { formatPeriod } from '../date';

describe('formatPeriod', () => {
  it('counts both endpoint months like LinkedIn', () => {
    // LinkedIn: CodeChef-VIT Junior Core, Feb 2025 – Jan 2026 = 1 year.
    expect(formatPeriod('2025-02', '2026-01')).toBe('Feb 2025 – Jan 2026 · 1 yr');
    // LinkedIn: Paradox, Dec 2025 – Aug 2026 = 9 months.
    expect(formatPeriod('2025-12', '2026-08')).toBe('Dec 2025 – Aug 2026 · 9 mos');
  });

  it('measures open roles up to the current month', () => {
    expect(formatPeriod('2026-10', null, new Date(2026, 9, 13))).toBe('Oct 2026 – Present · 1 mo');
    expect(formatPeriod('2023-06', '2025-03')).toBe('Jun 2023 – Mar 2025 · 1 yr 10 mos');
  });
});
