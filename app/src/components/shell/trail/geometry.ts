/** Distance between a lane and the edge of its section's column. */
export const LANE_GAP = 44;
/** Smallest distance a lane keeps from the viewport edge. */
export const EDGE_GAP = 16;
/** Corner radius where the trail turns between two lanes. */
export const CORNER = 22;

export interface TrailSection {
  id: string;
  /** Document Y where the section starts; the trail changes lanes here. */
  top: number;
  /** Viewport X of the lane beside this section. Columns can shift, so each section has its own. */
  x: number;
}

export interface TrailInput {
  /** Viewport width in px. */
  width: number;
  /** Document Y where the trail starts, under the hero. */
  startY: number;
  /** Document Y where the trail ends, at the foot of the content. */
  endY: number;
  sections: TrailSection[];
}

export interface TrailGeometry {
  d: string;
  /** Sections on the trail, with lanes clamped into the viewport. */
  stops: TrailSection[];
  /** Height of the SVG canvas: the trail plus its stroke. */
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const round = (value: number) => Math.round(value * 10) / 10;

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** Point `length` px from `from` towards `to`. */
function towards(from: Point, to: Point, length: number): Point {
  const ratio = length / (distance(from, to) || 1);
  return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio };
}

/** Polyline with quadratic corners, so the trail turns instead of breaking at right angles. */
export function roundedPath(points: Point[], radius = CORNER): string {
  if (points.length === 0) return '';
  const first = points[0]!;
  let d = `M ${round(first.x)} ${round(first.y)}`;
  if (points.length === 1) return d;

  for (let i = 1; i < points.length - 1; i += 1) {
    const corner = points[i]!;
    const before = points[i - 1]!;
    const after = points[i + 1]!;
    const r = Math.min(radius, distance(before, corner) / 2, distance(corner, after) / 2);
    const entry = towards(corner, before, r);
    const exit = towards(corner, after, r);
    d += ` L ${round(entry.x)} ${round(entry.y)} Q ${round(corner.x)} ${round(corner.y)} ${round(exit.x)} ${round(exit.y)}`;
  }
  const last = points[points.length - 1]!;
  return `${d} L ${round(last.x)} ${round(last.y)}`;
}

/**
 * The trail drops from the centre under the hero, then runs in each section's lane and turns
 * across at the section's top edge whenever the lane moves. The crossing is the boundary between
 * two sections, so the line doubles as the section divider.
 */
export function buildTrail(input: TrailInput): TrailGeometry {
  // A section above the start would send the trail backwards; it belongs to the hero, not the trail.
  const stops = input.sections
    .filter(section => section.top > input.startY)
    .map(section => ({
      ...section,
      x: Math.min(input.width - EDGE_GAP, Math.max(EDGE_GAP, section.x)),
    }));

  const points: Point[] = [{ x: input.width / 2, y: input.startY }];
  for (const stop of stops) {
    const previous = points[points.length - 1]!;
    if (stop.top > previous.y) points.push({ x: previous.x, y: stop.top });
    if (stop.x !== previous.x) points.push({ x: stop.x, y: stop.top });
  }
  const last = points[points.length - 1]!;
  if (input.endY > last.y) points.push({ x: last.x, y: input.endY });

  return { d: roundedPath(points), stops, height: input.endY + CORNER };
}
