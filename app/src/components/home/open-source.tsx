import { ArrowUpRight } from 'lucide-react';

import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { Logo } from '@/components/ui/brand-icon';
import { openSource } from '@/data/projects';

export function OpenSource() {
  return (
    <Section id="open-source" index="06" title="Open source">
      <Reveal as="ul" className="border-t border-line">
        {openSource.map(item => (
          <li key={item.href} data-reveal className="border-b border-line">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-4 py-4 outline-none"
            >
              <Logo name={item.name} src={item.icon} size={36} className="size-9" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="shrink-0 font-ui text-sm font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">{item.summary}</span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:text-teal"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-teal transition-transform duration-300 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
