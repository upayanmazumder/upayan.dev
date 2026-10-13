import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S
): WithSelectors<S> {
  const ext = store as WithSelectors<S>;
  ext.use = {} as WithSelectors<S>['use'];
  for (const key of Object.keys(store.getState())) {
    (ext.use as Record<string, () => unknown>)[key] = () =>
      store(s => (s as Record<string, unknown>)[key]);
  }
  return ext;
}
