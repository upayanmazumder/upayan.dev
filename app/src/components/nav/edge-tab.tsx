'use client';

import { useEffect, type Ref } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';

import { preloadMenu } from './lazy-overlays';
import { tabPath } from './liquid-path';
import { useMediaQuery } from './use-media-query';
import { useWindowHeight } from './use-window-height';

/** Width of the SVG strip on the right edge; the bulge never grows past it. */
const STRIP = 120;
/** Pointer distance from the right edge (px) where the tab starts to swell, and where it follows the cursor. */
const REACH = 220;
const FOLLOW = 300;

const SHAPES = {
  desktop: { depth: 30, half: 72, swell: 16, stretch: 24, inset: 24 },
  compact: { depth: 22, half: 46, swell: 0, stretch: 0, inset: 76 },
};

interface EdgeTabProps {
  open: boolean;
  /** Id of the menu panel, while it is mounted. */
  controls?: string;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Strip and button. Mounted only once the viewport height is known, so the springs start at rest:
 * a motion component freezes its first-render style, and starting at 0 left the tab off-screen.
 */
function TabBody({ height, open, controls, onToggle, ref }: EdgeTabProps & { height: number }) {
  const compact = useMediaQuery('(max-width: 767px)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const shape = compact ? SHAPES.compact : SHAPES.desktop;
  const restY = compact ? height - shape.inset - shape.half : height / 2;

  const targetY = useMotionValue(restY);
  const targetDepth = useMotionValue(shape.depth);
  const targetHalf = useMotionValue(shape.half);
  // The base lags behind the tip, which stretches the bulge toward the cursor like a drop of liquid.
  const baseY = useSpring(targetY, { stiffness: 120, damping: 22, mass: 0.9 });
  const tipY = useSpring(targetY, { stiffness: 260, damping: 28 });
  const depth = useSpring(targetDepth, { stiffness: 240, damping: 24 });
  const half = useSpring(targetHalf, { stiffness: 200, damping: 24 });

  const d = useTransform([baseY, tipY, depth, half], ([b, t, dp, h]: number[]) =>
    tabPath(STRIP, b!, t!, dp!, h!)
  );
  const buttonY = useTransform(tipY, y => y - (compact ? 32 : 40));
  const iconX = useTransform(depth, dp => -(dp / 2 - 8));

  useEffect(() => {
    targetY.set(restY);
    targetDepth.set(shape.depth);
    targetHalf.set(shape.half);
  }, [restY, shape, targetY, targetDepth, targetHalf]);

  useEffect(() => {
    if (compact || !finePointer || open) return;
    const margin = shape.half + shape.stretch + 16;
    // Far from the edge the targets sit at rest, so moves there return early and never wake the springs.
    // Starts unsettled so the first far move resets a bulge left over from before the menu opened.
    let resting = false;
    const rest = () => {
      resting = true;
      targetDepth.set(shape.depth);
      targetHalf.set(shape.half);
      targetY.set(restY);
    };
    const onMove = (event: PointerEvent) => {
      const fromEdge = window.innerWidth - event.clientX;
      if (fromEdge >= FOLLOW) {
        if (!resting) rest();
        return;
      }
      resting = false;
      // Close to the edge is intent to open: fetch the menu before the click.
      if (fromEdge < REACH) preloadMenu();
      const near = Math.min(Math.max(1 - fromEdge / REACH, 0), 1);
      targetDepth.set(shape.depth + near * shape.swell);
      targetHalf.set(shape.half + near * shape.stretch);
      targetY.set(Math.min(Math.max(event.clientY, margin), height - margin));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', rest);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', rest);
    };
  }, [height, compact, finePointer, open, restY, shape, targetY, targetDepth, targetHalf]);

  const swell = (on: boolean) => {
    targetDepth.set(shape.depth + (on ? Math.max(shape.swell, 8) : 0));
    targetHalf.set(shape.half + (on ? shape.stretch : 0));
  };

  return (
    <>
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_0_8px_var(--teal-dim)]"
        viewBox={`0 0 ${STRIP} ${height}`}
        preserveAspectRatio="none"
      >
        <m.path d={d} className="fill-surface stroke-teal/45" strokeWidth={1} />
      </svg>

      <m.button
        ref={ref}
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={controls}
        onClick={onToggle}
        onPointerEnter={preloadMenu}
        onFocus={() => {
          preloadMenu();
          swell(true);
        }}
        onBlur={() => swell(false)}
        className={cn(
          'pointer-events-auto absolute top-0 right-0 cursor-pointer rounded-l-full text-foreground outline-offset-[-6px] transition-colors hover:text-teal focus-visible:text-teal',
          compact ? 'h-16 w-12' : 'h-20 w-14'
        )}
        style={{ y: buttonY }}
      >
        <m.span
          aria-hidden
          className="absolute top-1/2 right-0 block size-4 -translate-y-1/2"
          style={{ x: iconX }}
        >
          <m.span
            className="absolute inset-x-0 top-1/2 h-px rounded-full bg-current"
            initial={false}
            animate={open ? { y: 0, rotate: 45 } : { y: -3, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          />
          <m.span
            className="absolute inset-x-0 top-1/2 h-px rounded-full bg-current"
            initial={false}
            animate={
              open
                ? { x: 0, y: 0, rotate: -45, scaleX: 1 }
                : { x: 3, y: 3, rotate: 0, scaleX: 0.62 }
            }
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          />
        </m.span>
      </m.button>
    </>
  );
}

/** Curved tab glued to the right edge. It follows the cursor Y with a spring and swells as the cursor gets close. */
export function EdgeTab(props: EdgeTabProps) {
  const height = useWindowHeight();
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-y-0 right-0 z-60 transition-opacity duration-300',
        height ? 'opacity-100' : 'opacity-0'
      )}
      style={{ width: STRIP }}
    >
      {height > 0 && <TabBody height={height} {...props} />}
    </div>
  );
}
