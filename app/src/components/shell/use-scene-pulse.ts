'use client';

import { useEffect, type RefObject } from 'react';

import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

import { EDGE_GAP, LANE_GAP } from './trail/geometry';
import { TRAIL_FOCUS, TRAIL_HIDDEN_ATTR, TRAIL_MIN_WIDTH } from './trail/roadmap-trail';

interface Origin {
  x: number;
  y: number;
  /** Radius that covers the whole stage from this point. */
  radius: number;
}

/** Where the rocket is, relative to the stage: its lane, at the trail's focus line. */
function rocketOrigin(section: HTMLElement, stage: HTMLElement): Origin {
  const width = document.documentElement.clientWidth;
  const column = (section.querySelector('.column') ?? section).getBoundingClientRect();
  const lane =
    width < TRAIL_MIN_WIDTH
      ? width / 2
      : section.dataset.trailSide === 'right'
        ? column.right + LANE_GAP
        : column.left - LANE_GAP;
  const box = stage.getBoundingClientRect();
  const x = Math.min(width - EDGE_GAP, Math.max(EDGE_GAP, lane)) - box.left;
  const y = window.innerHeight * TRAIL_FOCUS - box.top;
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(box.width - x, y),
    Math.hypot(x, box.height - y),
    Math.hypot(box.width - x, box.height - y)
  );
  return { x, y, radius };
}

const circle = (radius: number, { x, y }: Origin) => `circle(${radius}px at ${x}px ${y}px)`;

/**
 * Turns a staged section green while the rocket is inside it. When the rocket reaches the section
 * (from above or below), the trail and rocket hide and one bright pulse grows out of the rocket's
 * spot, then settles to deep green. When the rocket leaves, the
 * green shrinks back into its exit point and the trail returns. `ref` is any element in the section;
 * the section needs a `SceneBackdrop` in its stage.
 */
export function useScenePulse(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = ref.current?.closest('section');
    const stage = section?.querySelector<HTMLElement>('[data-stage]');
    const fill = stage?.querySelector('[data-scene-fill]');
    const flash = stage?.querySelector('[data-scene-flash]');
    if (!section || !stage || !fill || !flash) return;

    const html = document.documentElement;
    const reduced = prefersReducedMotion();
    let timeline: gsap.core.Timeline | null = null;
    let inside = false;

    const enter = () => {
      if (inside) return;
      inside = true;
      timeline?.kill();
      html.setAttribute(TRAIL_HIDDEN_ATTR, '');
      if (reduced) {
        gsap.set(fill, { autoAlpha: 1, clipPath: 'none' });
        return;
      }
      const origin = rocketOrigin(section, stage);
      // One sweep: the fill races out bright, and the flash only starts to fade once it has covered
      // the stage, so it never reads as a second pulse.
      timeline = gsap
        .timeline()
        .set(fill, { autoAlpha: 1, clipPath: circle(0, origin) })
        .set(flash, { opacity: 1 })
        .to(fill, { clipPath: circle(origin.radius, origin), duration: 0.7, ease: 'power3.out' })
        .to(flash, { opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.45);
    };

    const leave = () => {
      if (!inside) return;
      inside = false;
      timeline?.kill();
      if (reduced) {
        gsap.set(fill, { autoAlpha: 0 });
        html.removeAttribute(TRAIL_HIDDEN_ATTR);
        return;
      }
      const origin = rocketOrigin(section, stage);
      timeline = gsap
        .timeline({ onComplete: () => void gsap.set(fill, { autoAlpha: 0 }) })
        .to(flash, { opacity: 0, duration: 0.2 })
        .to(fill, { clipPath: circle(0, origin), duration: 0.7, ease: 'power3.inOut' }, 0)
        // The rocket returns just before the green has fully closed, so it reads as flying out of it.
        .call(() => html.removeAttribute(TRAIL_HIDDEN_ATTR), [], 0.45);
    };

    const focus = `${TRAIL_FOCUS * 100}%`;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: `top ${focus}`,
      end: `bottom ${focus}`,
      onEnter: enter,
      onEnterBack: enter,
      onLeave: leave,
      onLeaveBack: leave,
    });
    if (trigger.isActive) enter();

    return () => {
      trigger.kill();
      timeline?.kill();
      html.removeAttribute(TRAIL_HIDDEN_ATTR);
      gsap.set(fill, { autoAlpha: 0, clearProps: 'clipPath' });
      gsap.set(flash, { opacity: 0 });
    };
  }, [ref]);
}
