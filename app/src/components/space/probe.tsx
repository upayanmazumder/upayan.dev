/**
 * Tiny probe that rides the roadmap trail. Drawn pointing along +x so the trail can rotate it to the
 * path tangent. The thruster flickers while the trail is moving and the hull bobs while it rests;
 * both read `data-moving` from the trail root (`group/trail`).
 */
export function Probe() {
  return (
    <g className="[transform-origin:center] [transform-box:fill-box] group-data-[moving=false]/trail:animate-[probe-bob_2.6s_ease-in-out_infinite] motion-reduce:animate-none">
      <path
        d="M-9 0 L-19 -3 L-16 0 L-19 3 Z"
        fill="var(--teal)"
        className="[transform-origin:right] opacity-0 transition-opacity duration-300 [transform-box:fill-box] group-data-[moving=true]/trail:animate-[thrust_0.12s_steps(2)_infinite] group-data-[moving=true]/trail:opacity-90 motion-reduce:hidden"
      />
      <path d="M-6 -4 L-10 -8 L-2 -4 Z M-6 4 L-10 8 L-2 4 Z" fill="var(--teal)" opacity={0.8} />
      <path
        d="M-9 -4 L3 -4 Q10 -4 12 0 Q10 4 3 4 L-9 4 Q-7 0 -9 -4 Z"
        fill="var(--surface-2)"
        stroke="var(--teal)"
        strokeWidth={1}
      />
      <circle cx={3} cy={0} r={1.7} fill="var(--accent-foreground)" />
    </g>
  );
}
