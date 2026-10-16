'use client';

import { useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';

import { Logo } from '@/components/ui/brand-icon';
import type { Organization, Role } from '@/data/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { formatPeriod } from '@/utils';

/** Earliest start to latest end (null = present) across an org's roles. */
function orgSpan(roles: Role[]): { start: string; end: string | null } {
  const start = roles.map(r => r.start).sort()[0]!;
  const end = roles.some(r => r.end === null)
    ? null
    : roles
        .map(r => r.end!)
        .sort()
        .at(-1)!;
  return { start, end };
}

/**
 * Organizations with a vertical role timeline. The rail draws on scroll and the nodes pop in.
 * Without JS every role and its points stay visible.
 */
export function OrgTimeline({ orgs }: { orgs: Organization[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-org]').forEach(org => {
          const rail = org.querySelector('[data-rail]');
          const nodes = org.querySelectorAll('[data-node]');
          const roles = org.querySelectorAll('[data-role]');
          if (rail) {
            gsap.fromTo(
              rail,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: org, start: 'top 80%', end: 'bottom 60%', scrub: true },
              }
            );
          }
          gsap.from(nodes, {
            scale: 0,
            duration: 0.4,
            ease: 'back.out(1.4)',
            stagger: 0.05,
            scrollTrigger: { trigger: org, start: 'top 78%', once: true },
          });
          gsap.from(roles, {
            autoAlpha: 0,
            x: -8,
            duration: 0.45,
            stagger: 0.05,
            scrollTrigger: { trigger: org, start: 'top 78%', once: true },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <ol ref={ref} className="flex flex-col gap-12">
      {orgs.map(org => {
        const span = org.roles.length > 1 ? orgSpan(org.roles) : null;
        return (
          <li key={org.id} data-org className="flex flex-col gap-6">
            <header className="flex items-start gap-4">
              <Logo name={org.name} src={org.logo} size={44} className="size-11" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <h3 className="text-lg font-semibold">
                  {org.href ? (
                    <a
                      href={org.href}
                      target="_blank"
                      rel="noreferrer"
                      className="decoration-teal/60 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {org.name}
                    </a>
                  ) : (
                    org.name
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {[org.about, org.location].filter(Boolean).join(' · ')}
                </p>
                {span ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    {formatPeriod(span.start, span.end)}
                  </p>
                ) : null}
              </div>
            </header>

            <div className="relative ml-5 pl-7">
              <span
                aria-hidden
                data-rail
                className="absolute top-2 bottom-2 left-0 w-px origin-top bg-gradient-to-b from-teal/60 via-line-strong to-line"
              />
              <ol className="flex flex-col gap-6">
                {org.roles.map((role, i) => (
                  <RoleItem key={`${role.title}-${role.start}`} role={role} defaultOpen={i === 0} />
                ))}
              </ol>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function RoleItem({ role, defaultOpen }: { role: Role; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const current = role.end === null;
  const hasPoints = !!role.points?.length;

  const heading = (
    <>
      <span className="font-ui text-sm font-semibold text-foreground">{role.title}</span>
      <span className="font-mono text-xs text-muted-foreground">
        {formatPeriod(role.start, role.end)}
      </span>
    </>
  );

  return (
    <li data-role className="relative">
      <span
        aria-hidden
        data-node
        className="absolute top-1.5 -left-7 size-2.5 -translate-x-1/2 rounded-full border border-teal bg-background"
      >
        {current ? (
          <>
            <span className="absolute inset-0 rounded-full bg-teal" />
            <span className="absolute inset-0 animate-ping rounded-full bg-teal/30 [animation-duration:2.5s] motion-reduce:hidden motion-reduce:animate-none" />
          </>
        ) : null}
      </span>

      {hasPoints ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(o => !o)}
          className="group flex w-full items-start justify-between gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        >
          <span className="flex flex-col gap-0.5">{heading}</span>
          <span
            aria-hidden
            className={cn(
              'mt-0.5 font-mono text-sm text-muted-foreground transition-transform duration-300 group-hover:text-teal',
              open && 'rotate-45'
            )}
          >
            +
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-0.5">{heading}</div>
      )}

      {hasPoints ? (
        <div id={panelId}>
          <AnimatePresence initial={false}>
            {open ? (
              <m.div
                key="points"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <Points points={role.points!} />
              </m.div>
            ) : (
              // Hidden once JS runs; stays readable without JS.
              <div key="nojs" className="hidden [html:not(.js)_&]:block">
                <Points points={role.points!} />
              </div>
            )}
          </AnimatePresence>
        </div>
      ) : null}
    </li>
  );
}

function Points({ points }: { points: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 pt-3 text-sm text-muted-foreground">
      {points.map(p => (
        <li
          key={p}
          className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-px before:w-2 before:bg-line-strong"
        >
          {p}
        </li>
      ))}
    </ul>
  );
}
