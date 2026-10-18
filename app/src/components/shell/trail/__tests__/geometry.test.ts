import { describe, expect, it } from 'vitest';

import { buildTrail, EDGE_GAP, LANE_GAP, roundedPath, type TrailInput } from '../geometry';

const input: TrailInput = {
  width: 1600,
  columnWidth: 768,
  startY: 800,
  endY: 5000,
  sections: [
    { id: 'about', top: 1000, side: 'left' },
    { id: 'stack', top: 2000, side: 'right' },
    { id: 'work', top: 3000, side: 'left' },
  ],
};

const columnLeft = (input.width - input.columnWidth) / 2;
const leftLane = columnLeft - LANE_GAP;
const rightLane = columnLeft + input.columnWidth + LANE_GAP;

describe('buildTrail', () => {
  it('puts each stop in its section lane, beside the column', () => {
    const { stops } = buildTrail(input);

    expect(stops.map(stop => [stop.id, stop.x, stop.top])).toEqual([
      ['about', leftLane, 1000],
      ['stack', rightLane, 2000],
      ['work', leftLane, 3000],
    ]);
  });

  it('starts at the centre under the hero and ends at the foot of the content', () => {
    const { d, height } = buildTrail(input);

    expect(d.startsWith(`M ${input.width / 2} ${input.startY}`)).toBe(true);
    expect(d.endsWith(`${leftLane} ${input.endY}`)).toBe(true);
    expect(height).toBeGreaterThan(input.endY);
  });

  it('stays in one lane when consecutive sections share a side', () => {
    const { d } = buildTrail({
      ...input,
      sections: [
        { id: 'a', top: 1000, side: 'left' },
        { id: 'b', top: 2000, side: 'left' },
      ],
    });

    expect(d).not.toContain(` ${rightLane} `);
    expect(d).not.toContain(' 2000 Q');
  });

  it('keeps lanes inside the viewport when the margins are thin', () => {
    const { stops } = buildTrail({ ...input, width: 800 });

    expect(stops[0]!.x).toBe(EDGE_GAP);
    expect(stops[1]!.x).toBe(800 - EDGE_GAP);
  });

  it('drops sections that start above the trail', () => {
    const { d, stops } = buildTrail({ ...input, startY: 2500 });

    expect(stops.map(stop => stop.id)).toEqual(['work']);
    expect(d).not.toContain(' 1000');
    expect(d).not.toContain(' 2000');
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
