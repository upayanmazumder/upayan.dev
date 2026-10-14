/** Edge tab bulge in px. `width` is the SVG width; the bulge grows leftward from its right edge. */
export function tabPath(
  width: number,
  baseY: number,
  tipY: number,
  depth: number,
  half: number
): string {
  const tip = width - depth;
  return [
    `M${width} ${baseY - half}`,
    `C${width} ${baseY - half * 0.42} ${tip} ${tipY - half * 0.58} ${tip} ${tipY}`,
    `C${tip} ${tipY + half * 0.58} ${width} ${baseY + half * 0.42} ${width} ${baseY + half}`,
    'Z',
  ].join(' ');
}

/**
 * Full-screen flood in a 0–100 viewBox. Every keyframe has the same command structure so GSAP can tween
 * the numbers: the left edge runs from (edge, 0) through a tip at (tip, cy) down to (edge, 100).
 */
export function floodPath(edge: number, tip: number, cy: number, spread: number): string {
  return [
    `M100 0 L${edge} 0`,
    `C${edge} ${cy - spread} ${tip} ${cy - spread * 0.5} ${tip} ${cy}`,
    `C${tip} ${cy + spread * 0.5} ${edge} ${cy + spread} ${edge} 100`,
    'L100 100 Z',
  ].join(' ');
}

/** Flood keyframes that start from the tab bulge (all values in viewBox percent). */
export function floodFrames(cy: number, depth: number, half: number) {
  return {
    closed: floodPath(100, 100 - depth, cy, half),
    wave: floodPath(72, 18, cy, 38),
    full: floodPath(0, 0, cy, 38),
  };
}
