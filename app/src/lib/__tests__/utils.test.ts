import { describe, expect, it } from 'vitest';

import { cn } from '../utils';

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('merges conflicting tailwind classes — last wins', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('handles arrays', () => {
    expect(cn(['a', 'b'])).toBe('a b');
  });

  it('handles conditional objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });
});
