'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import { Probe } from '@/components/space';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

import { useLenis } from '../smooth-scroll';
import { buildTrail, CORNER, LANE_GAP, type TrailGeometry, type TrailSection } from './geometry';

/** Below this the margins are too thin for a lane, so the trail stays off. */
export const TRAIL_MIN_WIDTH = 1024;
/** Spacing of the length/Y lookup table, in px of path length. */
const SAMPLE = 16;
/** Head of the trail sits this far down the viewport. */
export const TRAIL_FOCUS = 0.55;
/** Attribute on `<html>` that hides the trail and rocket, e.g. while a staged section plays. */
export const TRAIL_HIDDEN_ATTR = 'data-trail-hidden';
/** Run-up between the hero and the first section, so the first corner has room to curve. */
const LEAD = 140;
/** The resting probe, flame included, reaches 14px above its point and 18px below, so its middle sits 2px low. */
const PROBE_CENTRE = -2;

function sameGeometry(a: TrailGeometry | null, b: TrailGeometry | null) {
  if (!a || !b) return a === b;
  return a.d === b.d && a.height === b.height && a.stops.length === b.stops.length;
}

/** Document Y of an element's top edge. */
const documentTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

/** Document Y of an element's layout box, ignoring transforms such as the hero's intro slide. */
function layoutTop(el: HTMLElement): number {
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null)
    y += node.offsetTop;
  return y;
}

/**
 * Where the trail starts: midway between the hero's last row of content and its scroll cue, so the
 * resting rocket keeps an even gap from both. Null off the home page or without a hero.
 */
function heroStart(): number | null {
  const hero = document.getElementById('hero');
  const content = hero?.querySelector<HTMLElement>('.column > :last-child');
  if (!hero || !content) return null;
  const above = layoutTop(content) + content.offsetHeight;
  const cue = hero.querySelector<HTMLElement>('[data-scroll-cue]');
  const below = cue ? layoutTop(cue) : layoutTop(hero) + hero.offsetHeight;
  return (above + below) / 2 + PROBE_CENTRE;
}

/**
 * The page roadmap: one line from under the hero to the foot of the page. Each `Section` declares
 * its lane with `data-trail-side`; the line runs in that margin and swaps sides at the boundary
 * between sections, so it doubles as the divider. A teal head draws it in as you scroll, and the
 * section the head is in gets `data-current`, which lights up its side heading.
 */
export function RoadmapTrail() {
  const lenis = useLenis();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [geometry, setGeometry] = useState<TrailGeometry | null>(null);

  // Geometry only changes when the page reflows, so scrolling never re-measures and never re-renders.
  useEffect(() => {
    const measure = () => {
      const width = document.documentElement.clientWidth;
      const main = document.querySelector('main');
      const elements = main
        ? [...main.querySelectorAll<HTMLElement>('section[data-trail-side]')]
        : [];
      if (!main || elements.length === 0 || width < TRAIL_MIN_WIDTH) {
        setGeometry(previous => (previous === null ? previous : null));
        return;
      }

      // Columns shift toward the trail when a section has a margin tile, so each lane hugs its own column.
      const sections: TrailSection[] = elements.map(el => {
        const column = (el.querySelector('.column') ?? el).getBoundingClientRect();
        return {
          id: el.id,
          top: documentTop(el),
          x: el.dataset.trailSide === 'right' ? column.right + LANE_GAP : column.left - LANE_GAP,
        };
      });
      const next = buildTrail({
        width,
        // Never so low that the first corner loses its curve.
        startY: Math.min(
          heroStart() ?? Math.max(documentTop(main), sections[0]!.top - LEAD),
          sections[0]!.top - 2 * CORNER
        ),
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

    // The probe faces along the path tangent and fires its thruster while the head is still gliding.
    let angle = 90;
    let rest = 0;
    const draw = (length: number) => {
      path.style.strokeDashoffset = `${total - length}`;
      const point = path.getPointAtLength(length);
      const ahead = path.getPointAtLength(Math.min(total, length + 2));
      if (Math.hypot(ahead.x - point.x, ahead.y - point.y) > 0.5) {
        angle = (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
      }
      head.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
      root.dataset.moving = 'true';
      window.clearTimeout(rest);
      rest = window.setTimeout(() => {
        root.dataset.moving = 'false';
      }, 260);
    };

    const state = { length: 0 };
    const glide = gsap.quickTo(state, 'length', {
      duration: 0.5,
      ease: 'power3.out',
      onUpdate: () => draw(state.length),
    });

    let current: string | null = null;
    const update = () => {
      const focus = window.scrollY + window.innerHeight * TRAIL_FOCUS;
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
    };

    update();
    if (lenis) lenis.on('scroll', update);
    else window.addEventListener('scroll', update, { passive: true });
    return () => {
      if (lenis) lenis.off('scroll', update);
      else window.removeEventListener('scroll', update);
      if (current) document.getElementById(current)?.removeAttribute('data-current');
      gsap.killTweensOf(state);
      window.clearTimeout(rest);
    };
  }, [geometry, lenis]);

  if (!geometry) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-moving="false"
      className="group/trail pointer-events-none absolute top-0 left-0 z-20 w-full transition-opacity duration-500 ease-out-expo max-lg:hidden [html[data-trail-hidden]_&]:opacity-0"
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
          <Probe />
        </g>
      </svg>
    </div>
  );
}
