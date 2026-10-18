import type { ReactNode } from 'react';

import type { TrailSide } from '@/components/nav/sections';
import { cn } from '@/lib/utils';

import { Reveal } from './reveal';

interface MarginTileProps {
  /** Margin the tile parks in: always the one without the trail. */
  side: TrailSide;
  /** Short mono caption above the tile, e.g. "Now playing". */
  caption: string;
  children: ReactNode;
}

/**
 * A small widget that fills the empty margin beside a section, opposite the roadmap trail. From
 * 87.5rem it parks in that margin, centred on the section, with a hairline reaching toward the
 * column. Below that there is no room, so it sits under the section content. Lay children out
 * against the `@container` wrapper, never the viewport.
 */
export function MarginTile({ side, caption, children }: MarginTileProps) {
  return (
    <div
      data-side={side}
      className={cn(
        'group/tile mt-12 min-[87.5rem]:absolute min-[87.5rem]:top-1/2 min-[87.5rem]:mt-0 min-[87.5rem]:w-[calc((100vw-var(--column))/2-6rem)] min-[87.5rem]:max-w-80 min-[87.5rem]:-translate-y-1/2',
        side === 'left'
          ? 'min-[87.5rem]:right-[calc(100%+4.5rem)]'
          : 'min-[87.5rem]:left-[calc(100%+4.5rem)]'
      )}
    >
      <Reveal className="@container relative">
        <p data-reveal className="label mb-3 flex items-center gap-2">
          <span aria-hidden className="h-px w-4 bg-teal/70" />
          {caption}
        </p>
        <div data-reveal>{children}</div>
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 hidden h-px w-10 from-line-strong to-transparent group-data-[side=left]/tile:left-full group-data-[side=left]/tile:ml-4 group-data-[side=left]/tile:bg-linear-to-r group-data-[side=right]/tile:right-full group-data-[side=right]/tile:mr-4 group-data-[side=right]/tile:bg-linear-to-l min-[87.5rem]:block"
        />
      </Reveal>
    </div>
  );
}
