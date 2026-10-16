import Image from 'next/image';

import { cn } from '@/lib/utils';

import { brandPaths } from './brand-paths';

interface BrandIconProps {
  /** Key in `brandPaths`: a simple-icons export name ("siGithub") or a custom key ("linkedin"). */
  icon?: string;
  /** Used for the monogram fallback and the accessible label. */
  name: string;
  className?: string;
  /** Decorative icons are hidden from assistive tech. */
  decorative?: boolean;
}

/** Monochrome brand glyph that inherits `currentColor`. Falls back to a monogram. */
export function BrandIcon({ icon, name, className, decorative = true }: BrandIconProps) {
  const path = icon ? brandPaths[icon] : undefined;
  if (!path) return <Monogram name={name} className={className} />;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('size-4 shrink-0', className)}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : name}
    >
      <path d={path} />
    </svg>
  );
}

/** Initials in a hairline square. Placeholder until a real logo exists. */
export function Monogram({ name, className }: { name: string; className?: string }) {
  // Words that start with a letter: "Clueminati ’26" → "CL", "GitHub Org Manager" → "GO".
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(word => /^\p{L}/u.test(word));
  const initials = (
    words.length > 1 ? words[0]![0]! + words[1]![0]! : (words[0] ?? '').slice(0, 2)
  ).toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center rounded-[25%] border border-line-strong bg-surface-2 font-ui text-[0.55em] font-semibold tracking-tight text-muted-foreground',
        className
      )}
    >
      {initials}
    </span>
  );
}

interface LogoProps {
  name: string;
  src?: string;
  className?: string;
  size?: number;
}

/** Organization or project logo image; monogram when no file exists yet. */
export function Logo({ name, src, className, size = 40 }: LogoProps) {
  if (!src) {
    return <Monogram name={name} className={cn('text-[0.8rem]', className)} />;
  }
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn('shrink-0 rounded-[25%] border border-line object-cover', className)}
    />
  );
}
