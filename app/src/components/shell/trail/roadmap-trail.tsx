'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { homeSections } from '@/components/nav/sections';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { useLenis } from '../smooth-scroll';
import { buildTrail, type TrailGeometry, type TrailSection } from './geometry';

const LABELS: Record<string, string> = Object.fromEntries(
  homeSections.map(section => [section.id, section.label])
);
/** Below this the margins are too thin for a lane, so the trail stays off. */
const MIN_WIDTH = 1024;
/** Spacing of the length/Y lookup table, in px of path length. */
const SAMPLE = 16;
/** Head of the trail sits this far down the viewport. */
const FOCUS = 0.55;
/** A section counts as current once its divider passes this far down the viewport. */
const PROBE = 0.35;
/** Run-up between the hero and the first divider, so the first corner has room to curve. */
const LEAD = 140;
const IDLE_MS = 900;

function sameGeometry(a: TrailGeometry | null, b: TrailGeometry | null) {
  if (!a || !b) return a === b;
  return (
    a.d === b.d &&
    a.height === b.height &&
    a.stops.length === b.stops.length &&
    a.stops.every((stop, i) => stop.id === b.stops[i]!.id)
  );
}

/** Document Y of an element's top edge. */
const documentTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/**
 * The page roadmap: one line that runs from under the hero to the foot of the page, swapping between
 * the left and right margins at every section divider. It crosses the column only on a divider
 * hairline. A teal head draws the line in as you scroll and each divider carries a labelled stop you
 * can click. Replaces the old left-edge scrollbar; native scrollbars stay hidden in globals.css.
 */
export function RoadmapTrail() {
  const lenis = useLenis();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [geometry, setGeometry] = useState<TrailGeometry | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Geometry only changes when the page reflows, so scrolling never re-measures and never re-renders.
  useEffect(() => {
    const measure = () => {
      const width = document.documentElement.clientWidth;
      const main = document.querySelector('main');
      const column = main?.querySelector('.column');
      if (!main || !column || width < MIN_WIDTH) {
        setGeometry(previous => (previous === null ? previous : null));
        return;
      }

      const sections: TrailSection[] = [...main.querySelectorAll<HTMLElement>('section[id]')]
        // Margin sections leave the flow on wide screens; they are beside the trail, not stops on it.
        .filter(el => LABELS[el.id] !== undefined && getComputedStyle(el).position !== 'absolute')
        .map(el => ({ id: el.id, label: LABELS[el.id]!, top: documentTop(el) }));
      if (sections.length === 0) {
        setGeometry(previous => (previous === null ? previous : null));
        return;
      }

      const next = buildTrail({
        width,
        columnWidth: column.getBoundingClientRect().width,
        startY: Math.max(documentTop(main), sections[0]!.top - LEAD),
        endY: documentTop(main) + main.getBoundingClientRect().height,
        sections,
      });
      setGeometry(previous => (sameGeometry(previous, next) ? previous : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pathname]);

  useEffect(() => {
    const root = rootRef.current;
    const path = progressRef.current;
    const head = headRef.current;
    if (!geometry || !root || !path || !head) return;

    const reduced = prefersReducedMotion();
    const total = path.getTotalLength();
    // Length→Y table. Y never decreases along the trail, so a binary search finds the furthest
    // length that is still above the head; on a horizontal run that is the whole crossing.
    const steps = Math.ceil(total / SAMPLE);
    const ys = new Float64Array(steps + 1);
    for (let i = 0; i <= steps; i += 1)
      ys[i] = path.getPointAtLength(Math.min(i * SAMPLE, total)).y;

    path.style.strokeDasharray = `${total}`;
    path.style.strokeDashoffset = `${total}`;

    const draw = (length: number) => {
      path.style.strokeDashoffset = `${total - length}`;
      const point = path.getPointAtLength(length);
      head.setAttribute('transform', `translate(${point.x} ${point.y})`);
    };

    const state = { length: 0 };
    const glide = gsap.quickTo(state, 'length', {
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => draw(state.length),
    });

    let current: string | null = null;
    let idle = 0;

    const update = () => {
      const focus = window.scrollY + window.innerHeight * FOCUS;
      let low = 0;
      let high = steps;
      while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        if (ys[mid]! <= focus) low = mid;
        else high = mid - 1;
      }
      const target = Math.min(total, low * SAMPLE);
      if (reduced) draw(target);
      else glide(target);

      const probe = window.scrollY + window.innerHeight * PROBE;
      let next: string | null = null;
      for (const stop of geometry.stops) if (stop.top <= probe) next = stop.id;
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const onScroll = () => {
      update();
      root.dataset.busy = 'true';
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        root.dataset.busy = 'false';
      }, IDLE_MS);
    };

    update();
    if (lenis) lenis.on('scroll', onScroll);
    else window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (lenis) lenis.off('scroll', onScroll);
      else window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
      gsap.killTweensOf(state);
    };
  }, [geometry, lenis]);

  if (!geometry) return null;

  const scrollTo = (top: number) => {
    if (lenis) lenis.scrollTo(top, { offset: -80, duration: 1.2 });
    else window.scrollTo({ top: top - 80, behavior: 'smooth' });
  };

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-busy="false"
      className="group/trail pointer-events-none absolute top-0 left-0 z-20 w-full max-lg:hidden"
      style={{ height: geometry.height }}
    >
      {/* No viewBox: one user unit is one CSS pixel, so the path uses document coordinates directly. */}
      <svg width="100%" height="100%" fill="none" className="absolute inset-0 overflow-visible">
        <path
          d={geometry.d}
          stroke="var(--line-strong)"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="opacity-50 transition-opacity duration-500 group-data-[busy=true]/trail:opacity-100"
        />
        <path
          ref={progressRef}
          d={geometry.d}
          stroke="var(--teal)"
          strokeWidth={2}
          strokeLinecap="round"
          className="[filter:drop-shadow(0_0_6px_color-mix(in_oklab,var(--teal)_55%,transparent))]"
        />
        <g ref={headRef}>
          <circle
            r={9}
            stroke="var(--teal)"
            strokeWidth={1}
            className="origin-center opacity-0 transition-opacity duration-500 group-data-[busy=true]/trail:animate-ping group-data-[busy=true]/trail:opacity-60 motion-reduce:hidden"
          />
          <circle r={3.5} fill="var(--teal)" />
        </g>
      </svg>

      {geometry.stops.map(stop => (
        <button
          key={stop.id}
          type="button"
          tabIndex={-1}
          title={stop.label}
          data-side={stop.side}
          data-active={stop.id === active}
          onPointerDown={() => scrollTo(stop.top)}
          style={{ left: stop.x, top: stop.top }}
          className="group/stop pointer-events-auto absolute flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
        >
          <span className="absolute size-2 rounded-full bg-background" />
          <span
            className={cn(
              'relative size-1.5 rounded-full transition-[background-color,scale] duration-300 group-hover/stop:scale-150',
              stop.id === active
                ? 'scale-125 bg-teal shadow-[0_0_10px_var(--teal)]'
                : 'bg-line-strong'
            )}
          />
          <span className="label absolute whitespace-nowrap opacity-0 transition-[opacity,translate] duration-500 ease-out-expo group-hover/stop:translate-x-0 group-hover/stop:opacity-100 group-data-[active=true]/stop:text-foreground group-data-[busy=true]/trail:translate-x-0 group-data-[busy=true]/trail:opacity-100 group-data-[side=left]/stop:right-5 group-data-[side=left]/stop:translate-x-1 group-data-[side=right]/stop:left-5 group-data-[side=right]/stop:-translate-x-1 max-xl:hidden">
            {stop.label}
          </span>
        </button>
      ))}
    </div>
  );
}
