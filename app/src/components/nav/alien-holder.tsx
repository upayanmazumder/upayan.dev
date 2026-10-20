import type { ReactNode } from 'react';

import { AlienFigure, Rock } from '@/components/space';
import { cn } from '@/lib/utils';

import { alienLook } from './alien-crew';

interface AlienHolderProps {
  /** Position in the crowd. It picks the pose, size and idle rhythm, so every render gives the same alien. */
  index: number;
  caption: string;
  /** The block: one link or button. */
  children: ReactNode;
}

const idle = 'motion-reduce:animate-none';

/** A sign held in front of the body: the face and paws show over its top edge and the feet below it. */
function Peek({
  width,
  mirror,
  children,
}: {
  width: string;
  mirror: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <AlienFigure pose="peek" mirror={mirror} style={{ width }} className="relative z-10 -mb-1" />
      {children}
      <span aria-hidden className="flex gap-2.5">
        <span className="h-2 w-1 rounded-b-full bg-teal" />
        <span className="h-2 w-1 rounded-b-full bg-teal" />
      </span>
    </>
  );
}

/**
 * One alien on the ground holding up a block; the block is the link or button. Each alien has its
 * own pose, height and stand, and blinks, sways and hops now and then on its own rhythm.
 */
export function AlienHolder({ index, caption, children }: AlienHolderProps) {
  const look = alienLook(index);
  const width = `${look.size.toFixed(2)}rem`;

  return (
    <li
      data-alien
      style={look.style}
      className="group/alien relative flex shrink-0 flex-col items-center"
    >
      <div
        className={cn(
          'flex origin-bottom animate-[alien-idle-hop_var(--alien-hop)_ease-out_infinite] flex-col items-center transition-[translate] duration-300 [animation-delay:var(--alien-hop-delay)] group-has-focus-visible/alien:-translate-y-1 motion-safe:group-hover/alien:animate-[alien-hop_0.45s_ease-in-out_infinite]',
          idle
        )}
      >
        <div
          className={cn(
            'flex origin-bottom rotate-(--alien-lean) animate-[alien-sway_var(--alien-sway)_ease-in-out_infinite] flex-col items-center [animation-delay:var(--alien-sway-delay)]',
            idle
          )}
        >
          {look.pose === 'peek' ? (
            <Peek width={`${(look.size * 1.35).toFixed(2)}rem`} mirror={look.mirror}>
              {children}
            </Peek>
          ) : (
            <>
              {children}
              <AlienFigure
                pose={look.pose}
                mirror={look.mirror}
                style={{ width }}
                className="-mt-1"
              />
              {look.stand === 'shoulders' && (
                <AlienFigure
                  mirror={!look.mirror}
                  style={{ width: `${(look.size * 1.2).toFixed(2)}rem` }}
                  className="-mt-2.5"
                />
              )}
            </>
          )}
          {look.stand === 'rock' && <Rock className="-mt-1 w-9" />}
        </div>
      </div>
      <span className="mt-1 font-mono text-[0.6rem] text-muted-foreground">{caption}</span>
    </li>
  );
}
