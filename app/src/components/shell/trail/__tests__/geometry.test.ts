import { describe, expect, it } from 'vitest';

import { buildTrail, EDGE_GAP, LANE_GAP, roundedPath, type TrailInput } from '../geometry';

const input: TrailInput = {
  width: 1600,
  columnWidth: 768,
  startY: 800,
  endY: 5000,
  sections: [
    { id: 'about', label: 'About', top: 1000 },
    { id: 'stack', label: 'Stack', top: 2000 },
    { id: 'work', label: 'Work', top: 3000 },
  ],
};

const columnLeft = (input.width - input.columnWidth) / 2;

describe('buildTrail', () => {
  it('alternates lanes and keeps them beside the column', () => {
    const { stops } = buildTrail(input);

    expect(stops.map(stop => stop.side)).toEqual(['left', 'right', 'left']);
    expect(stops[0]!.x).toBe(columnLeft - LANE_GAP);
    expect(stops[1]!.x).toBe(columnLeft + input.columnWidth + LANE_GAP);
  });

  it('places each stop on its section divider', () => {
    const { stops } = buildTrail(input);

    expect(stops.map(stop => stop.top)).toEqual([1000, 2000, 3000]);
    expect(stops.map(stop => Number(stop.at.toFixed(4)))).toEqual([0.0476, 0.2857, 0.5238]);
  });

  it('starts at the centre under the hero and ends at the foot of the content', () => {
    const { d, height } = buildTrail(input);

    expect(d.startsWith(`M ${input.width / 2} ${input.startY}`)).toBe(true);
    expect(d.endsWith(`${columnLeft - LANE_GAP} ${input.endY}`)).toBe(true);
    expect(height).toBeGreaterThan(input.endY);
  });

  it('keeps lanes inside the viewport when the margins are thin', () => {
    const { stops } = buildTrail({ ...input, width: 800 });

    expect(stops[0]!.x).toBe(EDGE_GAP);
    expect(stops[1]!.x).toBe(800 - EDGE_GAP);
  });

  it('skips sections that sit above the start of the trail', () => {
    const { d } = buildTrail({ ...input, startY: 2500 });

    expect(d).not.toContain(' 1000');
  });
});

describe('roundedPath', () => {
  it('turns corners with a quadratic curve limited by the shorter leg', () => {
    const d = roundedPath(
      [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 100, y: 10 },
      ],
      22
    );

    expect(d).toBe('M 0 0 L 0 5 Q 0 10 5 10 L 100 10');
  });

  it('returns a single move for a degenerate trail', () => {
    expect(roundedPath([{ x: 4, y: 8 }])).toBe('M 4 8');
    expect(roundedPath([])).toBe('');
  });
});
