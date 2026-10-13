import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { create } from 'zustand';

import { createSelectors } from '../create-selectors';

function makeStore() {
  const base = create<{ count: number; inc: () => void }>()(set => ({
    count: 0,
    inc: () => set(s => ({ count: s.count + 1 })),
  }));
  return createSelectors(base);
}

describe('createSelectors', () => {
  it('adds a use object with per-key hooks', () => {
    const store = makeStore();
    expect(typeof store.use.count).toBe('function');
    expect(typeof store.use.inc).toBe('function');
  });

  it('selector returns the current state value', () => {
    const store = makeStore();
    const { result } = renderHook(() => store.use.count());
    expect(result.current).toBe(0);
  });

  it('selector updates when state changes', () => {
    const store = makeStore();
    const { result } = renderHook(() => store.use.count());
    act(() => store.getState().inc());
    expect(result.current).toBe(1);
  });
});
