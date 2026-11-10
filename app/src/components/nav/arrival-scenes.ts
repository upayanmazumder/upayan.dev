'use client';

import { gsap } from '@/lib/gsap';

import type { UplinkMeter } from './uplink-meter';

/** The preloader parts that `useArrival` animates, looked up once. */
export interface ArrivalParts {
  ship: HTMLElement;
  layer: HTMLElement;
  night: Element | null;
  edge: Element | null;
  stars: Element | null;
  sceneryLayer: Element | null;
  scenery: NodeListOf<Element>;
  beam: Element | null;
  uplink: Element | null;
  bar: Element | null;
}

/** Viewport size and the hover offset from the dock, in px. */
export interface ArrivalGeometry {
  vw: number;
  vh: number;
  hoverY: number;
}

export interface IntroScene {
  timeline: gsap.core.Timeline;
  /** Idle bob and beam sweep. They repeat forever, so the caller kills them before the exit. */
  loops: gsap.core.Tween[];
}

export function findParts(ship: HTMLElement, layer: HTMLElement): ArrivalParts {
  return {
    ship,
    layer,
    night: layer.querySelector('[data-night]'),
    edge: layer.querySelector('[data-edge]'),
    stars: layer.querySelector('[data-stars]'),
    sceneryLayer: layer.querySelector('[data-scenery]'),
    scenery: layer.querySelectorAll('[data-scenery] > div > *'),
    beam: layer.querySelector('[data-beam]'),
    uplink: layer.querySelector('[data-uplink]'),
    bar: layer.querySelector('[data-bar]'),
  };
}

/** Act one beats, in seconds from hydration. */
const ARRIVE_AT = 0.3;
const ARRIVE_FOR = 1.4;
const SETTLE_FOR = 0.6;
const BEAM_AT = 1.6;
const UPLINK_AT = 1.9;
/** The fastest the uplink bar may fill, so even a cached load shows the fill. */
const UPLINK_FOR = 0.9;

/**
 * Act one: the scenery comes into focus as the saucer approaches, settles, and lights its beam.
 * The loading bar then appears and fills.
 */
export function introScene(
  { ship, sceneryLayer, scenery, beam, uplink }: ArrivalParts,
  { vw, vh, hoverY }: ArrivalGeometry,
  meter: UplinkMeter
): IntroScene {
  const loops: gsap.core.Tween[] = [];
  gsap.set(ship, {
    x: -vw * 0.55,
    y: hoverY - vh * 0.42,
    scale: 0.55,
    rotation: -16,
    autoAlpha: 0,
  });
  gsap.set(scenery, { autoAlpha: 0 });
  gsap.set(sceneryLayer, { opacity: 1 });
  gsap.set(beam, { scaleY: 0, autoAlpha: 0 });
  gsap.set(uplink, { y: 10 });

  const timeline = gsap
    .timeline()
    .fromTo(
      scenery,
      { filter: 'blur(6px)' },
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out',
        stagger: { each: 0.08, from: 'random' },
      },
      0.1
    )
    // The approach: fast across, slow down, and larger as it nears, banking through the turn.
    .to(ship, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, ARRIVE_AT)
    .to(ship, { x: 0, duration: ARRIVE_FOR, ease: 'power3.out' }, ARRIVE_AT)
    .to(ship, { y: hoverY + 12, scale: 2.6, duration: ARRIVE_FOR, ease: 'power2.inOut' }, ARRIVE_AT)
    .to(
      ship,
      {
        keyframes: [
          { rotation: 8, duration: ARRIVE_FOR * 0.55, ease: 'sine.inOut' },
          { rotation: 0, duration: ARRIVE_FOR * 0.55, ease: 'sine.inOut' },
        ],
      },
      ARRIVE_AT
    )
    .to(ship, { y: hoverY, duration: SETTLE_FOR, ease: 'sine.inOut' }, ARRIVE_AT + ARRIVE_FOR)
    // The beam projects down from under the saucer and catches with two soft flickers.
    .to(beam, { scaleY: 1, duration: 0.7, ease: 'power2.out' }, BEAM_AT)
    .to(
      beam,
      {
        keyframes: [
          { autoAlpha: 0.7, duration: 0.14 },
          { autoAlpha: 0.3, duration: 0.12 },
          { autoAlpha: 1, duration: 0.4 },
        ],
        ease: 'sine.inOut',
      },
      BEAM_AT
    )
    .call(
      () => {
        loops.push(
          gsap.to([ship, beam], {
            y: '-=7',
            duration: 1.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          }),
          gsap.to(beam, {
            rotation: 2.5,
            duration: 2.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          })
        );
      },
      [],
      ARRIVE_AT + ARRIVE_FOR + SETTLE_FOR
    )
    .to(uplink, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, UPLINK_AT - 0.1)
    .add(meter.pace(UPLINK_FOR), UPLINK_AT);

  return { timeline, loops };
}

/** Complete the loading bar before the saucer leaves. */
export function uplinkScene({ bar }: ArrivalParts, meter: UplinkMeter) {
  return gsap
    .timeline()
    .add(meter.finish())
    .fromTo(
      bar,
      { filter: 'brightness(2)' },
      { filter: 'brightness(1)', duration: 0.6, ease: 'sine.out' },
      '<'
    );
}

/** When the climb starts, and how long the night takes to lift. The saucer always leads the edge. */
const CLIMB_AT = 0.45;
const CLIMB_FOR = 1.2;
const LIFT_AT = 0.6;
const LIFT_FOR = 1.4;

/**
 * Act two: the loading bar fades, the beam retracts, and the saucer docks.
 * The night lifts behind it, revealing the page.
 */
export function departScene(
  { ship, layer, night, edge, stars, sceneryLayer, beam, uplink }: ArrivalParts,
  { vh, hoverY }: ArrivalGeometry,
  onReveal: () => void
) {
  const lift = { duration: LIFT_FOR, ease: 'power2.inOut' };
  return gsap
    .timeline()
    .to(uplink, { autoAlpha: 0, y: 8, duration: 0.35, ease: 'power2.in' }, 0)
    .to(beam, { scaleY: 0, autoAlpha: 0, rotation: 0, duration: 0.45, ease: 'power3.in' }, 0)
    .to(ship, { y: hoverY + 16, scale: 2.75, rotation: -5, duration: 0.45, ease: 'sine.inOut' }, 0)
    .to(ship, { scale: 1, duration: CLIMB_FOR + 0.1, ease: 'power2.inOut' }, CLIMB_AT)
    .to(ship, { y: -8, duration: CLIMB_FOR, ease: 'power2.inOut' }, CLIMB_AT)
    .to(
      ship,
      {
        keyframes: [
          { rotation: 6, duration: 0.55, ease: 'sine.out' },
          { rotation: 0, duration: 0.75, ease: 'sine.inOut' },
        ],
      },
      CLIMB_AT
    )
    .to(ship, { y: 0, duration: 0.6, ease: 'sine.out' }, CLIMB_AT + CLIMB_FOR)
    .to(night, { clipPath: 'inset(0% 0% 100% 0%)', ...lift }, LIFT_AT)
    .fromTo(edge, { y: vh }, { y: 0, ...lift }, LIFT_AT)
    .to(edge, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, LIFT_AT)
    .to(edge, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, LIFT_AT + LIFT_FOR - 0.35)
    .to(stars, { y: -vh * 0.12, ...lift }, LIFT_AT)
    .to(sceneryLayer, { y: -vh * 0.3, ...lift }, LIFT_AT)
    .call(onReveal, [], LIFT_AT + 0.45)
    .set(layer, { display: 'none' }, LIFT_AT + LIFT_FOR);
}
