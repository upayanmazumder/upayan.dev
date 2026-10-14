import { beforeEach, describe, expect, it } from 'vitest';

import { useUiStore } from '../ui-store';

describe('useUiStore overlays', () => {
  beforeEach(() => {
    useUiStore.setState({ overlay: null });
  });

  it('opening the palette replaces an open menu', () => {
    useUiStore.getState().open('menu');
    useUiStore.getState().open('palette');
    expect(useUiStore.getState().overlay).toBe('palette');
  });

  it('toggle closes the same overlay but switches from a different one', () => {
    const { toggle } = useUiStore.getState();
    toggle('menu');
    toggle('menu');
    expect(useUiStore.getState().overlay).toBeNull();
    toggle('menu');
    toggle('palette');
    expect(useUiStore.getState().overlay).toBe('palette');
  });
});
