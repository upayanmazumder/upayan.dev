import { cn } from '@/lib/utils';

/** A small floating astronaut with a teal visor and a tether. Sized by width; decorative only. */
export function Astronaut({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 52" className={cn('overflow-visible', className)}>
      <path d="M20 44 Q14 50 6 49" stroke="var(--line-strong)" strokeWidth={1} fill="none" />
      <rect x={10} y={20} width={20} height={20} rx={7} fill="var(--foreground)" opacity={0.9} />
      <rect x={13} y={24} width={7} height={5} rx={1.5} fill="var(--surface-2)" />
      <rect
        x={4}
        y={22}
        width={7}
        height={13}
        rx={3.5}
        fill="var(--foreground)"
        opacity={0.8}
        transform="rotate(-28 7 28)"
      />
      <rect
        x={29}
        y={22}
        width={7}
        height={13}
        rx={3.5}
        fill="var(--foreground)"
        opacity={0.8}
        transform="rotate(32 33 28)"
      />
      <rect
        x={12}
        y={37}
        width={6}
        height={12}
        rx={3}
        fill="var(--foreground)"
        opacity={0.85}
        transform="rotate(12 15 40)"
      />
      <rect
        x={22}
        y={37}
        width={6}
        height={12}
        rx={3}
        fill="var(--foreground)"
        opacity={0.85}
        transform="rotate(-16 25 40)"
      />
      <circle cx={20} cy={13} r={10} fill="var(--foreground)" />
      <ellipse cx={21.5} cy={13} rx={6.5} ry={5} fill="var(--teal)" opacity={0.85} />
      <ellipse cx={19.5} cy={11.5} rx={2} ry={1.2} fill="white" opacity={0.7} />
    </svg>
  );
}
