import { describe, expect, it } from 'vitest';

import { nanoid } from '../id';

describe('nanoid', () => {
  it('returns a string', () => {
    expect(typeof nanoid()).toBe('string');
  });

  it('returns a non-empty string', () => {
    expect(nanoid().length).toBeGreaterThan(0);
  });

  it('returns unique values', () => {
    expect(nanoid()).not.toBe(nanoid());
  });

  it('respects a custom size', () => {
    expect(nanoid(10)).toHaveLength(10);
  });
});
