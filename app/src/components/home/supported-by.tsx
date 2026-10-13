import Image from 'next/image';

import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { profile } from '@/data/profile';
import { sponsors } from '@/data/site';

const card =
  'group relative flex items-center gap-4 overflow-hidden rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_0_40px_-12px_var(--color-teal)] focus-visible:border-line-strong focus-visible:shadow-[0_0_40px_-12px_var(--color-teal)] focus-visible:outline-none';

export function SupportedBy() {
  return (
    <Section id="supported-by" index="10" title="Supported by">
      <Reveal className="grid gap-4 sm:grid-cols-2">
        {sponsors.map(s => {
          const body = (
            <>
              <Image
                src={encodeURI(s.logo)}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border border-line object-cover"
              />
              <span className="flex flex-col">
                <span className="font-ui font-semibold">{s.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{s.handle}</span>
              </span>
            </>
          );
          return s.href ? (
            <a
              key={s.handle}
              data-reveal
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className={card}
            >
              {body}
            </a>
          ) : (
            <div key={s.handle} data-reveal className={card}>
              {body}
            </div>
          );
        })}
        <a
          data-reveal
          href={profile.githubSponsors}
          target="_blank"
          rel="noreferrer"
          className={card + ' border-dashed'}
        >
          <span className="flex size-12 items-center justify-center rounded-full border border-line-strong text-teal">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-5 fill-current group-hover:animate-[heartbeat_1s_ease-in-out_infinite] group-focus-visible:animate-[heartbeat_1s_ease-in-out_infinite] motion-reduce:!animate-none"
            >
              <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2 0 3.4 1.1 4.2 2.4h2.4C14 6.1 15.4 5 17.4 5 21 5 23 8.6 21.6 11.8 19.5 16.4 12 21 12 21z" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="font-ui font-semibold">Become a sponsor</span>
            <span className="text-xs text-muted-foreground">Through GitHub Sponsors</span>
          </span>
          <span
            aria-hidden
            className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-teal"
          >
            →
          </span>
        </a>
      </Reveal>
      <style>{`@keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}45%{transform:scale(1.18)}}`}</style>
    </Section>
  );
}
