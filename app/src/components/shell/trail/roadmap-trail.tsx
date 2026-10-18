'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { useLenis } from '../smooth-scroll';
import { buildTrail, type TrailGeometry, type TrailSection } from './geometry';

/** Below this the margins are too thin for a lane, so the trail stays off. */
export const TRAIL_MIN_WIDTH = 1024;
/** Spacing of the length/Y lookup table, in px of path length. */
const SAMPLE = 16;
/** Head of the trail sits this far down the viewport. */
const FOCUS = 0.55;
/** Run-up between the hero and the first section, so the first corner has room to curve. */
const LEAD = 140;

function sameGeometry(a: TrailGeometry | null, b: TrailGeometry | null) {
  if (!a || !b) return a === b;
  return a.d === b.d && a.height === b.height && a.stops.length === b.stops.length;
}

/** Document Y of an element's top edge. */
const documentTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/**
 * The page roadmap: one line from under the hero to the foot of the page. Each `Section` declares
 * its lane with `data-trail-side`; the line runs in that margin and swaps sides at the boundary
 * between sections, so it doubles as the divider. A teal head draws it in as you scroll, and the
 * section the head is in gets `data-current`, which lights up its side heading.
 */
export function RoadmapTrail() {
  const lenis = useLenis();
  const pathname = usePathname();
  const progressRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [geometry, setGeometry] = useState<TrailGeometry | null>(null);
  const [active, setActive] = useState<string | null>(null);

  // Geometry only changes when the page reflows, so scrolling never re-measures and never re-renders.
  useEffect(() => {
    const measure = () => {
      const width = document.documentElement.clientWidth;
      const main = document.querySelector('main');
      const column = main?.querySelector('section[data-trail-side] .column');
      const elements = main
        ? [...main.querySelectorAll<HTMLElement>('section[data-trail-side]')]
        : [];
      if (!main || !column || elements.length === 0 || width < TRAIL_MIN_WIDTH) {
        setGeometry(previous => (previous === null ? previous : null));
        return;
      }

      const sections: TrailSection[] = elements.map(el => ({
        id: el.id,
        top: documentTop(el),
        side: el.dataset.trailSide === 'right' ? 'right' : 'left',
      }));
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
    const path = progressRef.current;
    const head = headRef.current;
    if (!geometry || !path || !head) return;

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

      let next: string | null = null;
      for (const stop of geometry.stops) if (stop.top <= focus) next = stop.id;
      if (next === current) return;
      if (current) document.getElementById(current)?.removeAttribute('data-current');
      if (next) document.getElementById(next)?.setAttribute('data-current', 'true');
      current = next;
      setActive(next);
    };

    update();
    if (lenis) lenis.on('scroll', update);
    else window.addEventListener('scroll', update, { passive: true });
    return () => {
      if (lenis) lenis.off('scroll', update);
      else window.removeEventListener('scroll', update);
      if (current) document.getElementById(current)?.removeAttribute('data-current');
      gsap.killTweensOf(state);
    };
  }, [geometry, lenis]);

  if (!geometry) return null;

  const scrollTo = (top: number) => {
    if (lenis) lenis.scrollTo(top, { duration: 1.2 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 z-20 w-full max-lg:hidden"
      style={{ height: geometry.height }}
    >
      {/* No viewBox: one user unit is one CSS pixel, so the path uses document coordinates directly. */}
      <svg width="100%" height="100%" fill="none" className="absolute inset-0 overflow-visible">
        <path
          d={geometry.d}
          stroke="var(--line-strong)"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="opacity-60"
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
            className="[transform-origin:center] animate-ping opacity-50 [animation-duration:2.4s] [transform-box:fill-box] motion-reduce:hidden"
          />
          <circle r={3.5} fill="var(--teal)" />
        </g>
      </svg>

      {geometry.stops.map(stop => (
        <button
          key={stop.id}
          type="button"
          tabIndex={-1}
          onPointerDown={() => scrollTo(stop.top)}
          style={{ left: stop.x, top: stop.top }}
          className="group/stop pointer-events-auto absolute flex size-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
        >
          <span className="absolute size-2.5 rounded-full bg-background" />
          <span
            className={cn(
              'relative size-1.5 rounded-full transition-[background-color,scale] duration-300 group-hover/stop:scale-150',
              stop.id === active
                ? 'scale-125 bg-teal shadow-[0_0_10px_var(--teal)]'
                : 'bg-line-strong'
            )}
          />
        </button>
      ))}
    </div>
  );
}
