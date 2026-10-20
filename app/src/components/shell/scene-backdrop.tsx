/**
 * Green field behind a staged section. `useScenePulse` grows it out of the rocket bright, then lets
 * it settle to a deep green. Hidden until then.
 */
export function SceneBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        data-scene-fill
        className="invisible absolute inset-0 bg-[color-mix(in_oklab,var(--teal)_13%,var(--background))]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,color-mix(in_oklab,var(--teal)_20%,transparent),transparent_70%)]" />
        <div data-scene-flash className="absolute inset-0 bg-teal opacity-0" />
      </div>
    </div>
  );
}
