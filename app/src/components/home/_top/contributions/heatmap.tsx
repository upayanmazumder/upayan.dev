'use client';

import {
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { cn } from '@/lib/utils';

import { describeDay, layoutCalendar, LEVEL_CLASS, type Day } from './calendar';
import { WEEK_GAP as GAP, useFitWeeks } from './use-fit-weeks';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -7,
  ArrowRight: 7,
  ArrowUp: -1,
  ArrowDown: 1,
};

interface Tip {
  slot: number;
  x: number;
  y: number;
}

interface HeatmapProps {
  weeks: { days: Day[] }[];
}

/** Year grid, newest week on the right. Hover or arrow keys show the day. */
export function Heatmap({ weeks }: HeatmapProps) {
  const { slots, weekCount, months } = useMemo(() => layoutCalendar(weeks), [weeks]);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [focusSlot, setFocusSlot] = useState(() => slots.findLastIndex(Boolean));
  const { cell, start } = useFitWeeks(containerRef, weekCount);
  const visibleWeeks = weekCount - start;

  const showFor = (el: HTMLElement) => {
    const slot = Number(el.dataset.slot);
    setTip({ slot, x: el.offsetLeft + cell / 2, y: el.offsetTop });
  };

  const onPointerOver = (event: PointerEvent<HTMLDivElement>) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>('[data-slot]');
    if (el) showFor(el);
  };

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>('[data-slot]');
    if (!el) return;
    setFocusSlot(Number(el.dataset.slot));
    showFor(el);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    let next = focusSlot + step;
    while (next >= start * 7 && next < slots.length && !slots[next]) next += step;
    if (next < start * 7 || next >= slots.length) return;
    gridRef.current?.querySelector<HTMLElement>(`[data-slot="${next}"]`)?.focus();
  };

  const tipDay = tip ? slots[tip.slot] : null;
  const tipBelow = tip ? tip.slot % 7 < 3 : false;
  const tipEdge = tip ? (Math.floor(tip.slot / 7) - start) / Math.max(1, visibleWeeks - 1) : 0;
  const firstSlot = start * 7;

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative flex gap-2">
        <div
          aria-hidden
          className="mt-5 grid w-[22px] shrink-0 font-mono text-[0.625rem] text-muted-foreground"
          style={{ gridTemplateRows: `repeat(7, ${cell}px)`, rowGap: GAP }}
        >
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="self-center leading-none">
              {label}
            </span>
          ))}
        </div>
        <div className="relative min-w-0">
          <div
            aria-hidden
            className="relative mb-2 h-3 font-mono text-[0.625rem] text-muted-foreground"
          >
            {months
              .filter(month => month.week >= start)
              .map(month => (
                <span
                  key={`${month.label}-${month.week}`}
                  className="absolute top-0 leading-3 whitespace-nowrap"
                  style={{ left: (month.week - start) * (cell + GAP) }}
                >
                  {month.label}
                </span>
              ))}
          </div>
          <div
            ref={gridRef}
            role="group"
            aria-label="Contribution calendar. Use arrow keys to move between days."
            className="relative grid grid-flow-col"
            style={{
              gridTemplateRows: `repeat(7, ${cell}px)`,
              gridAutoColumns: `${cell}px`,
              gap: GAP,
            }}
            onPointerOver={onPointerOver}
            onPointerLeave={() => setTip(null)}
            onFocus={onFocus}
            onBlur={() => setTip(null)}
            onKeyDown={onKeyDown}
          >
            {slots.map((day, slot) =>
              slot < firstSlot ? null : day ? (
                <span
                  key={day.date}
                  data-slot={slot}
                  role="img"
                  aria-label={describeDay(day)}
                  tabIndex={slot === focusSlot ? 0 : -1}
                  className={cn(
                    'rounded-[2px] outline-offset-1 hover:outline-1 hover:outline-line-strong focus-visible:outline-1',
                    LEVEL_CLASS[day.level]
                  )}
                />
              ) : (
                <span key={`empty-${slot}`} aria-hidden />
              )
            )}
          </div>
          {tip && tipDay ? (
            <div
              role="tooltip"
              className="pointer-events-none absolute z-10 rounded-md border border-line-strong bg-surface-2 px-2 py-1 font-mono text-[0.7rem] whitespace-nowrap text-foreground"
              style={{
                left: tip.x,
                top: tip.y + (tipBelow ? cell + 6 : -6) + 20,
                transform: `translate(${-tipEdge * 100}%, ${tipBelow ? 0 : -100}%)`,
              }}
            >
              {describeDay(tipDay)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
