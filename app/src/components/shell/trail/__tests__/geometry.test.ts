import { describe, expect, it } from 'vitest';

import { buildTrail, EDGE_GAP, roundedPath, type TrailInput } from '../geometry';

const input: TrailInput = {
  width: 1600,
  startY: 800,
  endY: 5000,
  sections: [
    { id: 'about', top: 1000, x: 300 },
    { id: 'stack', top: 2000, x: 1250 },
    { id: 'work', top: 3000, x: 360 },
  ],
};

describe('buildTrail', () => {
  it('runs from the centre under the hero through every lane to the foot of the content', () => {
    const { d, height } = buildTrail(input);

    expect(d).toBe(
      'M 800 800 L 800 978 Q 800 1000 778 1000 L 322 1000 Q 300 1000 300 1022 ' +
        'L 300 1978 Q 300 2000 322 2000 L 1228 2000 Q 1250 2000 1250 2022 ' +
        'L 1250 2978 Q 1250 3000 1228 3000 L 382 3000 Q 360 3000 360 3022 L 360 5000'
    );
    expect(height).toBeGreaterThan(input.endY);
  });

  it('goes straight down when consecutive sections share a lane', () => {
    const { d } = buildTrail({
      ...input,
      sections: [
        { id: 'a', top: 1000, x: 300 },
        { id: 'b', top: 2000, x: 300 },
      ],
    });

    expect(d).not.toContain(' 2000 Q');
    expect(d.endsWith('L 300 5000')).toBe(true);
  });

  it('clamps lanes into the viewport', () => {
    const { stops } = buildTrail({
      ...input,
      sections: [
        { id: 'a', top: 1000, x: -20 },
        { id: 'b', top: 2000, x: 1700 },
      ],
    });

    expect(stops.map(stop => stop.x)).toEqual([EDGE_GAP, input.width - EDGE_GAP]);
  });

  it('drops sections that start above the trail', () => {
    const { d, stops } = buildTrail({ ...input, startY: 2500 });

    expect(stops.map(stop => stop.id)).toEqual(['work']);
    expect(d).not.toContain(' 1000');
    expect(d).not.toContain(' 2000');
  });
});

describe('roundedPath', () => {
  it('limits the corner radius to half the shorter leg', () => {
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
