import { ArrowUpRight } from 'lucide-react';

import { Section } from '@/components/shell/section';
import { Logo } from '@/components/ui/brand-icon';
import { openSource } from '@/data/projects';

export function OpenSource() {
  return (
    <Section id="open-source" title="Open source">
      <ul className="divide-y divide-line">
        {openSource.map(item => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 py-4"
            >
              <Logo name={item.name} src={item.icon} size={36} className="size-9" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="shrink-0 text-sm font-semibold text-foreground transition-colors group-hover:text-teal">
                  {item.name}
                </span>
                <span className="text-sm text-muted-foreground">{item.summary}</span>
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal group-focus-visible:text-teal motion-reduce:transition-none"
              />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
