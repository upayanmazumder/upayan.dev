import { cn } from '@/lib/utils';

/** A small rock to stand on. Sized by width; the viewBox is 40×12. Decorative only. */
export function Rock({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 12"
      className={cn('pointer-events-none overflow-visible', className)}
    >
      <path
        d="M2 12 Q2.5 6 8 4.5 Q13 1 20 2.5 Q28 0.5 33 4.5 Q38.5 7 38 12 Z"
        strokeWidth={1}
        className="fill-surface-2 stroke-teal/30"
      />
      <path
        d="M11 6 Q15 4 19 5 M26 4.5 Q29 4.5 31 6"
        fill="none"
        strokeWidth={0.8}
        strokeLinecap="round"
        className="stroke-teal/20"
      />
    </svg>
  );
}
