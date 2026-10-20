import { cn } from '@/lib/utils';

/** A lumpy cratered rock. Sized by width; decorative only. */
export function Asteroid({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 34" className={cn('overflow-visible', className)}>
      <path
        d="M8 6 L19 2 L31 5 L38 15 L35 27 L23 32 L10 30 L2 20 Z"
        fill="oklch(0.3 0.008 240)"
        stroke="var(--muted-foreground)"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <circle cx={14} cy={12} r={3.5} fill="var(--background)" opacity={0.6} />
      <circle cx={26} cy={20} r={4.5} fill="var(--background)" opacity={0.5} />
      <circle cx={28} cy={10} r={2} fill="var(--background)" opacity={0.6} />
      <circle cx={13} cy={23} r={2.2} fill="var(--background)" opacity={0.5} />
    </svg>
  );
}
