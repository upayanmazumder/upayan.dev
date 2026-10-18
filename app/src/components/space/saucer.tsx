import { cn } from '@/lib/utils';

/**
 * The site's flying saucer: glass dome, disc, and a row of blinking lights. Sized by its width;
 * the viewBox is 64×28. Decorative only.
 */
export function Saucer({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 28" className={cn('overflow-visible', className)}>
      <ellipse
        cx={32}
        cy={12}
        rx={10}
        ry={8}
        fill="var(--accent)"
        stroke="var(--accent-foreground)"
      />
      <ellipse cx={29} cy={9} rx={3} ry={2} fill="var(--accent-foreground)" opacity={0.35} />
      <ellipse cx={32} cy={17} rx={28} ry={7} fill="var(--surface-2)" stroke="var(--teal)" />
      {[14, 26, 38, 50].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={18}
          r={1.6}
          fill="var(--teal)"
          className="animate-pulse motion-reduce:animate-none"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </svg>
  );
}
