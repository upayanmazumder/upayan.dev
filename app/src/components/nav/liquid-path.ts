/**
 * Full-screen flood in a 0–100 viewBox that pours down from the top edge. Every keyframe has the same
 * command structure so GSAP can tween the numbers. The lower edge runs from (100, edge) through a tip
 * at (cx, tip) to (0, edge). `spread` sets how wide the tip is.
 */
export function floodPath(edge: number, tip: number, cx: number, spread: number): string {
  return [
    `M0 0 L100 0 L100 ${edge}`,
    `C${cx + spread} ${edge} ${cx + spread * 0.5} ${tip} ${cx} ${tip}`,
    `C${cx - spread * 0.5} ${tip} ${cx - spread} ${edge} 0 ${edge}`,
    'Z',
  ].join(' ');
}

/**
 * Flood keyframes that start as a small drop under the saucer (all values in viewBox percent).
 * `cx` is the saucer centre, `depth` is its lower edge, and `half` is half its width.
 */
export function floodFrames(cx: number, depth: number, half: number) {
  return {
    closed: floodPath(0, depth, cx, half),
    // The centre runs ahead of the sides, so the liquid looks like it pours out of the saucer.
    wave: floodPath(22, 78, cx, 46),
    full: floodPath(100, 100, cx, 46),
  };
}
