/** Distance between a lane and the edge of the content column. */
export const LANE_GAP = 44;
/** Smallest distance a lane keeps from the viewport edge. */
export const EDGE_GAP = 16;
/** Corner radius where the trail turns between a lane and a section divider. */
export const CORNER = 22;

export interface TrailSection {
  id: string;
  /** Document Y where the section starts; the trail changes lanes here. */
  top: number;
  /** Lane the trail runs in beside this section. */
  side: 'left' | 'right';
}

export interface TrailStop extends TrailSection {
  x: number;
}

export interface TrailInput {
  /** Viewport width in px. */
  width: number;
  /** Rendered width of the content column in px. */
  columnWidth: number;
  /** Document Y where the trail starts, under the hero. */
  startY: number;
  /** Document Y where the trail ends, at the foot of the content. */
  endY: number;
  sections: TrailSection[];
}

export interface TrailGeometry {
  d: string;
  stops: TrailStop[];
  /** Height of the SVG canvas: the trail plus its stroke. */
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const round = (value: number) => Math.round(value * 10) / 10;

function lanes(width: number, columnWidth: number) {
  const columnLeft = (width - columnWidth) / 2;
  return {
    left: Math.max(EDGE_GAP, columnLeft - LANE_GAP),
    right: Math.min(width - EDGE_GAP, columnLeft + columnWidth + LANE_GAP),
  };
}

/**
 * Waypoints of the trail: it drops from the centre under the hero, then runs in each section's lane
 * and turns across at the section's top edge whenever the next lane is on the other side. The
 * crossing is the boundary between two sections, so the line doubles as the section divider.
 */
function waypoints(input: TrailInput, sections: TrailSection[]): Point[] {
  const { left, right } = lanes(input.width, input.columnWidth);
  const points: Point[] = [{ x: input.width / 2, y: input.startY }];

  for (const section of sections) {
    const lane = section.side === 'left' ? left : right;
    const previous = points[points.length - 1]!;
    if (section.top > previous.y) points.push({ x: previous.x, y: section.top });
    if (lane !== previous.x) points.push({ x: lane, y: section.top });
  }

  const last = points[points.length - 1]!;
  if (input.endY > last.y) points.push({ x: last.x, y: input.endY });
  return points;
}

const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

/** Point `length` px from `from` towards `to`. */
function towards(from: Point, to: Point, length: number): Point {
  const span = distance(from, to) || 1;
  const ratio = length / span;
  return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio };
}

/** Polyline with quadratic corners, so the trail turns instead of breaking at right angles. */
export function roundedPath(points: Point[], radius = CORNER): string {
  if (points.length === 0) return '';
  const first = points[0]!;
  if (points.length === 1) return `M ${round(first.x)} ${round(first.y)}`;

  let d = `M ${round(first.x)} ${round(first.y)}`;
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

/** Path data plus the stop that belongs to each section, ready to render. */
export function buildTrail(input: TrailInput): TrailGeometry {
  // A section above the start would send the trail backwards; it belongs to the hero, not the trail.
  const sections = input.sections.filter(section => section.top > input.startY);
  const { left, right } = lanes(input.width, input.columnWidth);
  const stops: TrailStop[] = sections.map(section => ({
    ...section,
    x: section.side === 'left' ? left : right,
  }));

  return { d: roundedPath(waypoints(input, sections)), stops, height: input.endY + CORNER };
}
