import { cn } from '@/lib/utils';

/**
 * A saucer that peeks out from behind a margin tile on hover and shines a tractor beam onto it.
 * Place inside an `isolate` box with a `group/tile` ancestor: the saucer sits behind the card and
 * rises out, the beam is drawn over the card. Decorative only.
 */
export function Ufo({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-x-0 top-0', className)}>
      <svg
        viewBox="0 0 64 28"
        className="absolute -top-1 right-8 -z-10 w-14 translate-y-5 opacity-0 transition-[translate,opacity] duration-500 ease-out-expo group-hover/tile:-translate-y-6 group-hover/tile:opacity-100 motion-reduce:hidden"
      >
        <g className="[transform-origin:center] [transform-box:fill-box] group-hover/tile:animate-[ufo-wobble_2.2s_ease-in-out_infinite]">
          <ellipse
            cx={32}
            cy={12}
            rx={10}
            ry={8}
            fill="var(--accent)"
            stroke="var(--accent-foreground)"
          />
          <ellipse cx={32} cy={17} rx={28} ry={7} fill="var(--surface-2)" stroke="var(--teal)" />
          {[14, 26, 38, 50].map((cx, i) => (
            <circle
              key={cx}
              cx={cx}
              cy={18}
              r={1.6}
              fill="var(--teal)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </g>
      </svg>
      <span className="absolute top-0 right-8 h-24 w-14 origin-top scale-y-0 bg-linear-to-b from-teal/25 to-transparent opacity-0 transition-[scale,opacity] delay-0 duration-300 [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)] group-hover/tile:scale-y-100 group-hover/tile:opacity-100 group-hover/tile:delay-300 motion-reduce:hidden" />
      <span className="absolute top-0 right-8 z-10 h-24 w-14 origin-top scale-y-0 bg-linear-to-b from-teal/25 to-transparent opacity-0 transition-[scale,opacity] delay-0 duration-300 [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)] group-hover/tile:scale-y-100 group-hover/tile:opacity-100 group-hover/tile:delay-300 motion-reduce:hidden" />
    </span>
  );
}
