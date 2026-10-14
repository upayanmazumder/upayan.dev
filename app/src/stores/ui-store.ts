import { create } from 'zustand';

/** Which full-screen overlay is open. Only one can be open at a time. */
export type Overlay = 'menu' | 'palette' | null;

interface UiState {
  overlay: Overlay;
  open: (overlay: Exclude<Overlay, null>) => void;
  /** Opens the overlay, or closes it if it is already open. */
  toggle: (overlay: Exclude<Overlay, null>) => void;
  close: () => void;
}

/** Read with an inline selector, e.g. `useUiStore(state => state.overlay)`. */
export const useUiStore = create<UiState>()(set => ({
  overlay: null,
  open: overlay => set({ overlay }),
  toggle: overlay => set(state => ({ overlay: state.overlay === overlay ? null : overlay })),
  close: () => set({ overlay: null }),
}));
