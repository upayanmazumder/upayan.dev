'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';

import { linkKind, useNavAction } from './use-nav-action';

// The apex is as wide as the hovering saucer's disc (4rem at 1.5× scale), so the light leaves the
// whole underside instead of a narrow point.
const CONE = '[clip-path:polygon(calc(50%-2.6rem)_0,calc(50%+2.6rem)_0,100%_100%,0_100%)]';

/**
 * The saucer's tractor beam, drawn as a trapezium of light from under the hovering saucer down to
 * the ground, with the site pages projected inside it as a hologram: scanlines, a slow glint, and a
 * faint flicker. `MenuPanel` animates `[data-hologram]` open and staggers `[data-holo-link]` in.
 */
export function MenuHologram() {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();

  return (
    <div
      data-hologram
      className="absolute top-(--holo-top) bottom-[calc(var(--ground)-1.5rem)] left-1/2 w-[min(94vw,54rem)] origin-top -translate-x-1/2"
    >
      <div aria-hidden className={cn('absolute inset-0 overflow-hidden', CONE)}>
        <div className="absolute inset-0 bg-linear-to-b from-teal/35 via-teal/12 to-teal/6" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_3px,color-mix(in_oklab,var(--teal)_14%,transparent)_3px_4px)]" />
        <div className="absolute inset-x-0 -top-1/4 h-1/4 animate-[holo-glint_4.5s_linear_infinite] bg-linear-to-b from-transparent via-teal/20 to-transparent motion-reduce:hidden" />
      </div>
      <nav
        aria-label="Site"
        className="absolute inset-x-[10%] top-[30%] bottom-28 flex items-end justify-center md:top-[26%] md:bottom-32"
      >
        <ol className="grid w-full animate-[holo-flicker_6s_steps(1)_infinite] grid-cols-1 gap-y-2 text-center motion-reduce:animate-none md:grid-cols-2 md:gap-x-10 md:gap-y-5">
          {navItems.map((item, index) => {
            const external = linkKind(item.href) === 'external';
            const current = !item.href.includes('#') && item.href === pathname;
            const className =
              'group/holo block outline-offset-4 [text-shadow:0_0_14px_color-mix(in_oklab,var(--teal)_60%,transparent)]';
            const content = (
              <>
                <span className="flex items-baseline justify-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      'font-mono text-xs tabular-nums',
                      current ? 'text-foreground' : 'text-teal/70'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-display text-[clamp(1.5rem,6vw,2.75rem)] leading-none font-medium tracking-tight transition-[color,translate] duration-300 group-hover/holo:-translate-y-0.5 group-hover/holo:text-foreground group-focus-visible/holo:text-foreground md:text-[clamp(1.75rem,3.4vw,2.75rem)]',
                      current ? 'text-foreground' : 'text-teal'
                    )}
                  >
                    {item.label}
                  </span>
                </span>
                <span className="mt-1 block font-ui text-xs text-teal/60">
                  {item.hint}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
              </>
            );
            return (
              <li key={item.href} data-holo-link>
                {external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                    onClick={event => onLinkClick(event, item.href)}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={current ? 'page' : undefined}
                    className={className}
                    onClick={event => onLinkClick(event, item.href)}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
