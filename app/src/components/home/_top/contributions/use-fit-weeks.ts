'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

const GAP = 3;
const MIN_CELL = 8;
const MAX_CELL = 13;
/** Day-label column plus the gap beside it. */
const LABEL_WIDTH = 30;

export interface WeekFit {
  /** Square cell size in px. */
  cell: number;
  /** First visible week; earlier weeks are dropped on narrow screens. */
  start: number;
}

/**
 * Sizes the calendar to its container instead of scrolling it sideways. Wide containers show
 * every week with cells up to 13 px; narrow ones keep the newest weeks that fit at 8 px or more.
 */
export function useFitWeeks(ref: RefObject<HTMLElement | null>, weekCount: number): WeekFit {
  const [fit, setFit] = useState<WeekFit>({ cell: 10, start: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth - LABEL_WIDTH;
      const visible = Math.max(
        1,
        Math.min(weekCount, Math.floor((width + GAP) / (MIN_CELL + GAP)))
      );
      const cell = Math.min(MAX_CELL, Math.floor((width - (visible - 1) * GAP) / visible));
      setFit(prev =>
        prev.cell === cell && prev.start === weekCount - visible
          ? prev
          : { cell, start: weekCount - visible }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, weekCount]);

  return fit;
}

export { GAP as WEEK_GAP };
