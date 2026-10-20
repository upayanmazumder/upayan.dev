import type { CSSProperties } from 'react';

// The beam is a trapezium. It is `APEX` wide at the top and the full hologram width at the bottom.
export const APEX = '5.2rem';
// The links fill the band from 10% of the beam height down to `FLOOR` above the beam's foot.
// `FLOOR` keeps the aliens on the ground clear of the bottom row.
const TOP = 0.1;
const FLOOR = '8.5rem';
// From 700px of viewport height, the rows fill at least 60% of the beam height. Row k of n therefore
// never starts above `TOP + k * SPAN / n`, where the cone is narrowest for that row.
const SPAN = 0.6;
// Light kept clear on each side of a row, plus room for the row number.
const MARGIN = '3.5rem';

// The cone width at the highest point that row `index` of `count` can start.
const cone = (index: number, count: number) =>
  `(${APEX} + ${(TOP + (index * SPAN) / count).toFixed(3)} * (100cqw - ${APEX}))`;

/**
 * Style for the `<ol>`: its box in the beam and its row count. It also sets the tallest label one
 * row allows (`--holo-fit`), and for each row the widest label size that fits the cone (`--holo-cap-k`).
 */
export function holoListStyle(labels: readonly string[]): CSSProperties {
  const count = labels.length;
  const caps = Object.fromEntries(
    labels.map((label, index) => {
      // A safe estimate of the label width in em for the display font, from measured glyph widths.
      const labelEm = 0.6 * label.length + 0.6;
      return [
        `--holo-cap-${index}`,
        `calc((${cone(index, count)} - ${MARGIN}) / ${labelEm.toFixed(1)})`,
      ];
    })
  );
  return {
    top: `${TOP * 100}%`,
    bottom: FLOOR,
    gridTemplateRows: `repeat(${count}, minmax(0, 1fr))`,
    '--holo-fit': `min(3.25rem, calc(((${100 - TOP * 100}cqh - ${FLOOR}) / ${count} - 1.6rem) * 0.9))`,
    ...caps,
  } as CSSProperties;
}

/**
 * Style for one row. Labels grow with depth like a projection, so the size never gets smaller from
 * one row to the next. When a long label lower down must shrink to fit, the rows above it shrink too.
 */
export function holoRowStyle(index: number, count: number): CSSProperties {
  const depth = count > 1 ? index / (count - 1) : 1;
  const below = Array.from(
    { length: count - index },
    (_, offset) => `var(--holo-cap-${index + offset})`
  );
  return {
    '--holo-row': `calc(${cone(index, count)} - 2rem)`,
    '--holo-label': `min(calc(${(0.78 + 0.22 * depth).toFixed(3)} * var(--holo-fit)), ${below.join(', ')})`,
  } as CSSProperties;
}
