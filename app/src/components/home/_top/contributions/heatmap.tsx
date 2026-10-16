'use client';

import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { gsap, useGSAP } from '@/lib/gsap';

import { describeDay, layoutCalendar, type Day } from './calendar';
import { WEEK_GAP as GAP, useFitWeeks } from './use-fit-weeks';

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -7,
  ArrowRight: 7,
  ArrowUp: -1,
  ArrowDown: 1,
};
const GRID_HEIGHT = 7 * 13 + 6 * GAP;

interface HeatmapProps {
  weeks: { days: Day[] }[];
}

/** Year grid, newest week on the right. The canvas keeps one keyboard stop for the selected day. */
export function Heatmap({ weeks }: HeatmapProps) {
  const { slots, weekCount, months } = useMemo(() => layoutCalendar(weeks), [weeks]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerSlotRef = useRef<number | null>(null);
  const descriptionId = useId();
  const [tipSlot, setTipSlot] = useState<number | null>(null);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const [focusSlot, setFocusSlot] = useState(() => slots.findLastIndex(Boolean));
  const [isFocused, setIsFocused] = useState(false);
  const [pixelRatio, setPixelRatio] = useState(1);
  const [themeVersion, setThemeVersion] = useState(0);
  const { cell, start } = useFitWeeks(containerRef, weekCount);
  const firstSlot = start * 7;
  const visibleWeeks = weekCount - start;
  const width = visibleWeeks * (cell + GAP) - GAP;
  const height = 7 * (cell + GAP) - GAP;
  const activeSlot =
    focusSlot >= firstSlot && slots[focusSlot]
      ? focusSlot
      : slots.findLastIndex((day, slot) => slot >= firstSlot && !!day);
  const activeDay = slots[activeSlot];
  const tipDay = tipSlot === null ? null : slots[tipSlot];

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) {
      setCanvasSupported(false);
      return;
    }
    if (width <= 0) return;

    const scale = pixelRatio;
    const backingWidth = Math.round(width * scale);
    const backingHeight = Math.round(height * scale);
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);

    const style = getComputedStyle(canvas);
    const teal = style.getPropertyValue('--teal').trim();
    const surface = style.getPropertyValue('--surface-2').trim();
    for (let slot = firstSlot; slot < slots.length; slot++) {
      const day = slots[slot];
      if (!day) continue;
      const x = (Math.floor(slot / 7) - start) * (cell + GAP);
      const y = (slot % 7) * (cell + GAP);
      context.fillStyle = day.level ? teal : surface;
      context.globalAlpha = day.level ? [1, 0.25, 0.45, 0.7, 1][day.level] : 1;
      context.beginPath();
      context.roundRect(x, y, cell, cell, 2);
      context.fill();
    }
    context.globalAlpha = 1;
    if (isFocused && activeSlot >= firstSlot) {
      const x = (Math.floor(activeSlot / 7) - start) * (cell + GAP);
      const y = (activeSlot % 7) * (cell + GAP);
      context.strokeStyle = teal;
      context.lineWidth = 1;
      context.strokeRect(x + 0.5, y + 0.5, cell - 1, cell - 1);
    }
    if (tipSlot !== null && tipDay && tipSlot !== activeSlot) {
      const x = (Math.floor(tipSlot / 7) - start) * (cell + GAP);
      const y = (tipSlot % 7) * (cell + GAP);
      context.fillStyle = 'white';
      context.globalAlpha = 0.12;
      context.beginPath();
      context.roundRect(x, y, cell, cell, 2);
      context.fill();
      context.globalAlpha = 1;
    }
  }, [
    activeSlot,
    cell,
    firstSlot,
    height,
    isFocused,
    pixelRatio,
    slots,
    start,
    themeVersion,
    tipDay,
    tipSlot,
    width,
  ]);

  useLayoutEffect(() => {
    const syncPixelRatio = () => setPixelRatio(window.devicePixelRatio || 1);
    syncPixelRatio();
    window.addEventListener('resize', syncPixelRatio);
    const density = window.matchMedia(`(resolution: ${pixelRatio}dppx)`);
    density.addEventListener('change', syncPixelRatio);
    const themeObserver = new MutationObserver(() => setThemeVersion(version => version + 1));
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    return () => {
      window.removeEventListener('resize', syncPixelRatio);
      density.removeEventListener('change', syncPixelRatio);
      themeObserver.disconnect();
    };
  }, [pixelRatio]);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(canvas, {
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: canvas, start: 'top 85%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: canvasRef }
  );

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const column = Math.floor(x / (cell + GAP));
    const row = Math.floor(y / (cell + GAP));
    const slot = (start + column) * 7 + row;
    const day =
      column >= 0 &&
      column < visibleWeeks &&
      row >= 0 &&
      row < 7 &&
      x - column * (cell + GAP) < cell &&
      y - row * (cell + GAP) < cell
        ? slots[slot]
        : null;
    const nextSlot = day ? slot : null;
    if (pointerSlotRef.current !== nextSlot) {
      pointerSlotRef.current = nextSlot;
      setTipSlot(nextSlot);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    const step = KEY_STEP[event.key];
    if (!step) return;
    event.preventDefault();
    let next = activeSlot + step;
    while (next >= firstSlot && next < slots.length && !slots[next]) next += step;
    if (next < firstSlot || next >= slots.length) return;
    pointerSlotRef.current = null;
    setFocusSlot(next);
    setTipSlot(next);
  };

  const tipBelow = tipSlot !== null && tipSlot % 7 < 3;
  const tipEdge =
    tipSlot !== null ? (Math.floor(tipSlot / 7) - start) / Math.max(1, visibleWeeks - 1) : 0;
  const fallback = useMemo(
    () =>
      slots
        .slice(firstSlot)
        .filter((day): day is Day => day !== null)
        .map(describeDay)
        .join('; '),
    [firstSlot, slots]
  );

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative flex gap-2">
        <div
          aria-hidden
          className="mt-5 grid w-[22px] shrink-0 font-mono text-[0.625rem] text-muted-foreground"
          style={{ gridTemplateRows: `repeat(7, ${cell}px)`, rowGap: GAP, height: GRID_HEIGHT }}
        >
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="self-center leading-none">
              {label}
            </span>
          ))}
        </div>
        <div className="relative min-w-0" style={{ width, maxWidth: '100%' }}>
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
          <div className="relative overflow-hidden" style={{ height: GRID_HEIGHT }}>
            <canvas
              ref={canvasRef}
              tabIndex={activeDay ? 0 : -1}
              role="group"
              aria-label="Contribution calendar. Use arrow keys to move between days."
              aria-describedby={descriptionId}
              className="block outline-none"
              style={{ display: canvasSupported ? 'block' : 'none', width, height }}
              onPointerMove={onPointerMove}
              onPointerLeave={() => {
                pointerSlotRef.current = null;
                setTipSlot(null);
              }}
              onFocus={() => {
                setIsFocused(true);
                setTipSlot(activeSlot);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTipSlot(null);
              }}
              onKeyDown={onKeyDown}
            >
              Contribution calendar. Daily contribution counts are listed below if canvas is
              unavailable.
            </canvas>
            <span id={descriptionId} className="sr-only" aria-live="polite">
              {activeDay ? describeDay(activeDay) : 'No contributions available'}
            </span>
          </div>
          {!canvasSupported ? (
            <p className="font-mono text-xs text-muted-foreground">{fallback}</p>
          ) : null}
          {tipDay && tipSlot !== null && tipSlot >= firstSlot ? (
            <div
              role="tooltip"
              className="pointer-events-none absolute z-10 rounded-md border border-line-strong bg-surface-2 px-2 py-1 font-mono text-[0.7rem] whitespace-nowrap text-foreground shadow-lg"
              style={{
                left: (Math.floor(tipSlot / 7) - start) * (cell + GAP) + cell / 2,
                top: 20 + (tipSlot % 7) * (cell + GAP) + (tipBelow ? cell + 6 : -6),
                transform: `translate(${-tipEdge * 100}%, ${tipBelow ? 0 : -100}%)`,
              }}
            >
              {describeDay(tipDay)}
            </div>
          ) : null}
        </div>
      </div>
      <noscript>
        <p>{fallback}</p>
      </noscript>
    </div>
  );
}
