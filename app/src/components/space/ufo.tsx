import { cn } from '@/lib/utils';

import { Saucer } from './saucer';

/**
 * A saucer that peeks out from behind a margin tile on hover and shines a tractor beam onto it.
 * Place inside an `isolate` box with a `group/tile` ancestor: the saucer sits behind the card and
 * rises out, the beam is drawn over the card. Decorative only.
 */
export function Ufo({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-x-0 top-0', className)}>
      <span className="absolute -top-1 right-8 -z-10 w-14 translate-y-5 opacity-0 transition-[translate,opacity] duration-500 ease-out-expo group-hover/tile:-translate-y-6 group-hover/tile:opacity-100 motion-reduce:hidden">
        <Saucer className="w-full group-hover/tile:animate-[ufo-wobble_2.2s_ease-in-out_infinite]" />
      </span>
      <span className="absolute top-0 right-8 z-10 h-24 w-14 origin-top scale-y-0 bg-linear-to-b from-teal/25 to-transparent opacity-0 transition-[scale,opacity] delay-0 duration-300 [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)] group-hover/tile:scale-y-100 group-hover/tile:opacity-100 group-hover/tile:delay-300 motion-reduce:hidden" />
    </span>
  );
}
