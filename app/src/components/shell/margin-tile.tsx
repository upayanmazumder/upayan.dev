import type { ReactNode } from 'react';

import type { TrailSide } from '@/components/nav/sections';
import { Ufo } from '@/components/space';
import { cn } from '@/lib/utils';

import { Reveal } from './reveal';

interface MarginTileProps {
  /** Margin the tile parks in: always the one without the trail. */
  side: TrailSide;
  children: ReactNode;
}

/**
 * A widget in the margin opposite the roadmap trail, vertically centred on its section. From
 * 87.5rem it sits 2.5rem off the column, which `Section` has moved toward the trail by `--s`, with a
 * hairline bridging the gap. Below that there is no room, so it sits under the section content.
 * Lay children out against the `@container` wrapper, never the viewport.
 */
export function MarginTile({ side, children }: MarginTileProps) {
  return (
    <div
      data-side={side}
      className={cn(
        'group/tile mx-auto mt-12 max-w-md min-[87.5rem]:absolute min-[87.5rem]:top-1/2 min-[87.5rem]:mt-0 min-[87.5rem]:w-[min(18rem,calc((100vw-var(--column))/2+var(--s)-4rem))] min-[87.5rem]:-translate-y-1/2',
        side === 'left'
          ? 'min-[87.5rem]:right-[calc(100%+2.5rem)]'
          : 'min-[87.5rem]:left-[calc(100%+2.5rem)]'
      )}
    >
      <Reveal className="@container relative isolate">
        <Ufo />
        {children}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 hidden h-px w-10 from-line-strong to-transparent group-data-[side=left]/tile:left-full group-data-[side=left]/tile:bg-linear-to-r group-data-[side=right]/tile:right-full group-data-[side=right]/tile:bg-linear-to-l min-[87.5rem]:block"
        />
      </Reveal>
    </div>
  );
}
