import type { Ref } from 'react';

import { DeepSpace } from '@/components/space';

/**
 * Full-screen first-load overlay. It paints as plain night first; `useArrival` then brings in the
 * stars and scenery, flies the saucer (the menu button, `UfoTab`) in to hover over it, switches on
 * the beam and uplink bar, and finally flies the saucer up to its dock as the overlay lifts.
 * Shown only by the `.preloader` CSS gate.
 */
export function Preloader({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="preloader fixed inset-0 z-[85] overflow-hidden bg-background [clip-path:inset(0%_0%_0%_0%)]"
    >
      <div
        data-stars
        className="absolute -inset-[420px] animate-[stars-drift_40s_linear_infinite] bg-[radial-gradient(1px_1px_at_12%_18%,var(--foreground),transparent),radial-gradient(1px_1px_at_32%_72%,var(--foreground),transparent),radial-gradient(1.5px_1.5px_at_58%_28%,var(--teal),transparent),radial-gradient(1px_1px_at_78%_64%,var(--foreground),transparent),radial-gradient(1px_1px_at_88%_14%,var(--accent-foreground),transparent),radial-gradient(1px_1px_at_44%_88%,var(--foreground),transparent),radial-gradient(1.5px_1.5px_at_8%_58%,var(--accent-foreground),transparent),radial-gradient(1px_1px_at_68%_92%,var(--foreground),transparent)] bg-[length:420px_420px] opacity-0 motion-reduce:animate-none"
      />
      <div data-scenery className="absolute inset-0 opacity-0">
        <DeepSpace />
      </div>
      <div
        data-beam
        className="absolute top-[45vh] left-1/2 h-[45vh] w-[36vmin] origin-top -translate-x-1/2 bg-linear-to-b from-teal/30 via-teal/10 to-transparent opacity-0 [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)]"
      />
      <div
        data-uplink
        className="absolute inset-x-0 bottom-[14vh] flex flex-col items-center gap-3 opacity-0"
      >
        <p className="label">Establishing uplink</p>
        <span className="h-px w-40 overflow-hidden bg-line-strong">
          <span
            data-bar
            className="block h-full origin-left bg-teal shadow-[0_0_8px_var(--teal)]"
          />
        </span>
      </div>
    </div>
  );
}
