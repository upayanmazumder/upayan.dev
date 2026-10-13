import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useUiStore } from '../ui-store';

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: false });
  });

  it('has sidebarOpen false by default', () => {
    const { result } = renderHook(() => useUiStore.use.sidebarOpen());
    expect(result.current).toBe(false);
  });

  it('setSidebarOpen sets the value directly', () => {
    const { result } = renderHook(() => useUiStore.use.sidebarOpen());
    act(() => useUiStore.getState().setSidebarOpen(true));
    expect(result.current).toBe(true);
  });

  it('toggleSidebar flips the value', () => {
    const { result } = renderHook(() => useUiStore.use.sidebarOpen());
    act(() => useUiStore.getState().toggleSidebar());
    expect(result.current).toBe(true);
    act(() => useUiStore.getState().toggleSidebar());
    expect(result.current).toBe(false);
  });
});
