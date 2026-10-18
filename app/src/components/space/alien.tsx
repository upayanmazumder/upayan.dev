import { cn } from '@/lib/utils';

/**
 * A small green alien with both arms raised, as if holding something overhead. Place the held item
 * directly above it. Sized by width; the viewBox is 32×36. Decorative only.
 */
export function AlienFigure({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 36" className={cn('overflow-visible', className)}>
      <path
        d="M9 13 L5 2 M23 13 L27 2"
        stroke="var(--teal)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M12 6 L11 1 M20 6 L21 1"
        stroke="var(--teal)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <circle cx={11} cy={1} r={1.4} fill="var(--accent-foreground)" />
      <circle cx={21} cy={1} r={1.4} fill="var(--accent-foreground)" />
      <ellipse cx={16} cy={12} rx={8.5} ry={7.5} fill="var(--teal)" />
      <ellipse cx={12.6} cy={12} rx={2.6} ry={3.2} fill="var(--background)" />
      <ellipse cx={19.4} cy={12} rx={2.6} ry={3.2} fill="var(--background)" />
      <circle cx={13.2} cy={11} r={0.9} fill="white" />
      <circle cx={20} cy={11} r={0.9} fill="white" />
      <path d="M11 20 Q16 18 21 20 L22 30 Q16 32 10 30 Z" fill="var(--teal)" opacity={0.85} />
      <path
        d="M12 30 L11 35 M20 30 L21 35"
        stroke="var(--teal)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}
