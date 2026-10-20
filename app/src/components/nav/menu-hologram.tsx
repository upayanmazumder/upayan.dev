'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/data/site';
import { cn } from '@/lib/utils';

import { APEX, holoListStyle, holoRowStyle } from './holo-fit';
import { linkKind, useNavAction } from './use-nav-action';

// The apex is as wide as the hovering saucer's disc, so the light leaves the whole underside.
const cone = {
  clipPath: `polygon(calc(50% - ${APEX} / 2) 0, calc(50% + ${APEX} / 2) 0, 100% 100%, 0 100%)`,
};

/**
 * The saucer's tractor beam: a trapezium of light from under the hovering saucer down to the ground.
 * The site pages show inside it as a hologram, one per row, and each row grows with depth like a
 * projection. `MenuPanel` projects `[data-hologram]` down and makes `[data-holo-link]` appear in order.
 */
export function MenuHologram() {
  const pathname = usePathname();
  const { onLinkClick } = useNavAction();

  return (
    <div
      data-hologram
      className="[container-type:size] absolute top-(--holo-top) bottom-[calc(var(--ground)-1.5rem)] left-1/2 w-[min(94vw,54rem)] origin-top -translate-x-1/2"
    >
      <div aria-hidden style={cone} className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-teal/35 via-teal/12 to-teal/6" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_3px,color-mix(in_oklab,var(--teal)_14%,transparent)_3px_4px)]" />
        <div className="absolute inset-x-0 -top-1/4 h-1/4 animate-[holo-glint_4.5s_linear_infinite] bg-linear-to-b from-transparent via-teal/20 to-transparent motion-reduce:hidden" />
      </div>
      <nav aria-label="Site">
        <ol
          style={holoListStyle(navItems.map(item => item.label))}
          className="absolute inset-x-0 grid animate-[holo-flicker_6s_steps(1)_infinite] text-center motion-reduce:animate-none"
        >
          {navItems.map((item, index) => {
            const external = linkKind(item.href) === 'external';
            const current = !item.href.includes('#') && item.href === pathname;
            const className =
              'group/holo inline-block max-w-(--holo-row) outline-offset-4 [text-shadow:0_0_14px_color-mix(in_oklab,var(--teal)_60%,transparent)]';
            const content = (
              <>
                <span className="flex items-baseline justify-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      'font-mono text-[0.6875rem] tabular-nums',
                      current ? 'text-foreground' : 'text-teal/70'
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-display text-(length:--holo-label) leading-none font-medium tracking-tight whitespace-nowrap transition-[color,translate] duration-300 group-hover/holo:-translate-y-0.5 group-hover/holo:text-foreground group-focus-visible/holo:text-foreground',
                      current ? 'text-foreground' : 'text-teal'
                    )}
                  >
                    {item.label}
                  </span>
                </span>
                <span className="mt-1 block font-ui text-[0.6875rem] leading-tight text-balance text-teal/60">
                  {item.hint}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </span>
              </>
            );
            return (
              <li
                key={item.href}
                data-holo-link
                style={holoRowStyle(index, navItems.length)}
                className="flex min-h-0 flex-col items-center justify-center"
              >
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
