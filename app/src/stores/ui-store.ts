import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createSelectors } from './create-selectors';

interface UiState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const useUiStoreBase = create<UiState>()(
  persist(
    set => ({
      sidebarOpen: false,
      setSidebarOpen: open => set({ sidebarOpen: open }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'ui-store' }
  )
) as unknown as UseBoundStore<StoreApi<UiState>>;

export const useUiStore = createSelectors(useUiStoreBase);
