import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

const ROW = 'flex items-center gap-3 py-3';

export function SupportedBy() {
  return (
    <Section id="supported-by" title="Supported by">
      <div className="flex flex-col gap-6">
        <ul className="divide-y divide-line border-y border-line">
          {sponsors.map(s => {
            const body = (
              <>
                <Image
                  src={encodeURI(s.logo)}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full border border-line object-cover"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{s.name}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {s.handle}
                  </span>
                </span>
              </>
            );
            return (
              <li key={s.handle}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${ROW} transition-colors hover:text-teal`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={ROW}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        <a
          href={profile.githubSponsors}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
        >
          Sponsor me on GitHub
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </a>
      </div>
    </Section>
  );
}
