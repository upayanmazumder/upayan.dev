/** Distance between a lane and the edge of the content column. */
export const LANE_GAP = 44;
/** Smallest distance a lane keeps from the viewport edge. */
export const EDGE_GAP = 16;
/** Corner radius where the trail turns between a lane and a section divider. */
export const CORNER = 22;

export interface TrailSection {
  id: string;
  label: string;
  /** Document Y of the section's top divider. */
  top: number;
}

export interface TrailStop extends TrailSection {
  x: number;
  side: 'left' | 'right';
  /** 0–1 position along the trail, used for the dot state. */
  at: number;
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
 * Waypoints of the trail: it drops from the centre under the hero, turns into the left lane at the
 * first section divider, and swaps lanes at every divider after that. Horizontal runs sit exactly on
 * a divider hairline, so the trail only ever crosses the column where the page already draws a line.
 */
function waypoints(input: TrailInput, sections: TrailSection[]): Point[] {
  const { left, right } = lanes(input.width, input.columnWidth);
  const points: Point[] = [{ x: input.width / 2, y: input.startY }];

  sections.forEach((section, index) => {
    const lane = index % 2 === 0 ? left : right;
    const previous = points[points.length - 1]!;
    if (section.top > previous.y) points.push({ x: previous.x, y: section.top });
    if (lane !== previous.x) points.push({ x: lane, y: section.top });
  });

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
  const span = Math.max(1, input.endY - input.startY);

  const stops: TrailStop[] = sections.map((section, index) => ({
    ...section,
    x: index % 2 === 0 ? left : right,
    side: index % 2 === 0 ? 'left' : 'right',
    at: Math.min(1, Math.max(0, (section.top - input.startY) / span)),
  }));

  return { d: roundedPath(waypoints(input, sections)), stops, height: input.endY + CORNER };
}
