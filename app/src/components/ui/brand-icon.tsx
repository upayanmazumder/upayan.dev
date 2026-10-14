import Image from 'next/image';
import * as simpleIcons from 'simple-icons';

import { cn } from '@/lib/utils';

/** Paths for brands that simple-icons no longer ships. 24×24 viewBox. */
const customIcons: Record<string, string> = {
  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  microsoft: 'M0 0h11.4v11.4H0zM12.6 0H24v11.4H12.6zM0 12.6h11.4V24H0zM12.6 12.6H24V24H12.6z',
};

type SimpleIcon = { path: string; title: string };

function resolvePath(icon: string): string | undefined {
  if (icon in customIcons) return customIcons[icon];
  const found = (simpleIcons as unknown as Record<string, SimpleIcon | undefined>)[icon];
  return found?.path;
}

interface BrandIconProps {
  /** simple-icons export name ("siGithub") or a custom key ("linkedin"). */
  icon?: string;
  /** Used for the monogram fallback and the accessible label. */
  name: string;
  className?: string;
  /** Decorative icons are hidden from assistive tech. */
  decorative?: boolean;
}

/** Monochrome brand glyph that inherits `currentColor`. Falls back to a monogram. */
export function BrandIcon({ icon, name, className, decorative = true }: BrandIconProps) {
  const path = icon ? resolvePath(icon) : undefined;
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
