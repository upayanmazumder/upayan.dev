import { Logo } from '@/components/ui/brand-icon';
import type { Organization } from '@/data/types';
import { formatPeriod } from '@/utils';

/** Full text and links survive without the scroll animation or disclosure JavaScript. */
export function WorkStatic({ orgs }: { orgs: Organization[] }) {
  return (
    <ol className="flex flex-col gap-12">
      {orgs.map(org => {
        const span =
          org.roles.length > 1
            ? {
                start: org.roles.map(role => role.start).sort()[0]!,
                end: org.roles.some(role => role.end === null)
                  ? null
                  : org.roles
                      .map(role => role.end!)
                      .sort()
                      .at(-1)!,
              }
            : null;
        return (
          <li key={org.id} className="flex flex-col gap-6">
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
                className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-teal/60 via-line-strong to-line"
              />
              <ol className="flex flex-col gap-6">
                {org.roles.map((role, i) => (
                  <li key={`${role.title}-${role.start}`} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-7 size-2.5 -translate-x-1/2 rounded-full border border-teal bg-background"
                    >
                      {role.end === null ? (
                        <>
                          <span className="absolute inset-0 rounded-full bg-teal" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-teal/30 [animation-duration:2.5s] motion-reduce:hidden motion-reduce:animate-none" />
                        </>
                      ) : null}
                    </span>
                    <div className="flex items-start justify-between gap-3 rounded-md">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-ui text-sm font-semibold text-foreground">
                          {role.title}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {formatPeriod(role.start, role.end)}
                        </span>
                      </span>
                      {role.points?.length ? (
                        <span
                          aria-hidden
                          className="mt-0.5 font-mono text-sm text-muted-foreground"
                        >
                          +
                        </span>
                      ) : null}
                    </div>
                    {role.points?.length ? (
                      <ul
                        className={`flex flex-col gap-1.5 pt-3 text-sm text-muted-foreground ${i > 0 ? 'hidden [html:not(.js)_&]:flex' : ''}`}
                      >
                        {role.points.map(point => (
                          <li
                            key={point}
                            className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-px before:w-2 before:bg-line-strong"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
