import type { Ref } from 'react';

import { DeepSpace } from '@/components/space';

const STARS =
  'bg-[radial-gradient(1px_1px_at_12%_18%,var(--foreground),transparent),radial-gradient(1px_1px_at_32%_72%,var(--foreground),transparent),radial-gradient(1.5px_1.5px_at_58%_28%,var(--teal),transparent),radial-gradient(1px_1px_at_78%_64%,var(--foreground),transparent),radial-gradient(1px_1px_at_88%_14%,var(--accent-foreground),transparent),radial-gradient(1px_1px_at_44%_88%,var(--foreground),transparent),radial-gradient(1.5px_1.5px_at_8%_58%,var(--accent-foreground),transparent),radial-gradient(1px_1px_at_68%_92%,var(--foreground),transparent)] bg-[length:420px_420px]';

/**
 * Full-screen first-load overlay. It paints as plain night first. `useArrival` then brings the
 * stars and scenery into focus, flies the saucer (the menu button, `UfoTab`) in to hover, switches
 * on the beam, and fills the uplink bar with the real load progress. When the page is ready, the
 * saucer climbs to its dock and pulls the night up behind it. Shown only by the `.preloader` gate.
 */
export function Preloader({ ref }: { ref: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} aria-hidden className="preloader pointer-events-none fixed inset-0 z-[85]">
      <div
        data-night
        className="pointer-events-auto absolute inset-0 overflow-hidden bg-background [clip-path:inset(0%_0%_0%_0%)]"
      >
        <NightSky />
      </div>
      {/* The lit edge of the night as it lifts, so the reveal reads as a sweep, not a hard cut. */}
      <div data-edge className="absolute inset-x-0 top-0 h-0 opacity-0">
        <span className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-teal/12 to-transparent" />
        <span className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal/70 to-transparent shadow-[0_0_14px_var(--teal)]" />
      </div>
    </div>
  );
}

function NightSky() {
  return (
    <>
      {/* The stars fade in with CSS from the first paint, before hydration. GSAP only lifts this
          layer on the way out; the inner field keeps its own CSS drift. */}
      <div
        data-stars
        className="absolute inset-0 animate-[preloader-stars_1.6s_ease-out_both] motion-reduce:animate-none"
      >
        <div
          className={`absolute -inset-[420px] animate-[stars-drift_60s_linear_infinite] motion-reduce:animate-none ${STARS}`}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[45vh] bg-[radial-gradient(60%_80%_at_50%_100%,var(--teal-dim),transparent_70%)] opacity-40"
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
        <div className="grid">
          <p data-uplink-busy className="label col-start-1 row-start-1 text-center">
            Establishing uplink
          </p>
          <p
            data-uplink-done
            className="label col-start-1 row-start-1 text-center text-teal opacity-0"
          >
            Uplink established
          </p>
        </div>
        <span className="flex items-center gap-3">
          <span className="h-px w-44 overflow-hidden bg-line-strong">
            <span
              data-bar
              className="block h-full origin-left scale-x-0 bg-teal shadow-[0_0_8px_var(--teal)]"
            />
          </span>
          <span
            data-percent
            className="w-9 text-right font-mono text-[0.6875rem] text-muted-foreground tabular-nums"
          >
            0%
          </span>
        </span>
      </div>
    </>
  );
}
