/**
 * Fixed page frame: two vertical rails around the content column plus film grain.
 * Decorative only; sits behind content and ignores pointer events.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 [contain:strict]">
      {/* From lg the roadmap trail frames each section, and columns shift, so fixed rails would misalign. */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-(--column) -translate-x-1/2 border-x border-line lg:hidden" />
      {/* No blend mode: this fixed layer is its own stacking context, so overlay only ever blended with transparency. */}
      <div className="grain absolute inset-0 opacity-[0.035]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-background to-transparent" />
    </div>
  );
}
