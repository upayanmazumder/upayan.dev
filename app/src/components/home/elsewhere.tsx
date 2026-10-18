import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials } from '@/data/profile';

export function Elsewhere() {
  return (
    <Section id="elsewhere" index="10" title="Elsewhere">
      <Reveal
        as="ul"
        stagger={0.04}
        className="grid grid-cols-1 gap-2 min-[440px]:grid-cols-2 sm:grid-cols-3"
      >
        {otherSocials.map(s => (
          <li key={s.id} data-reveal>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-[transform,border-color] duration-200 hover:-translate-y-px hover:border-line-strong focus-visible:-translate-y-px focus-visible:border-teal focus-visible:outline-none"
            >
              <BrandIcon
                icon={s.icon}
                name={s.label}
                className="size-4 text-muted-foreground transition-colors group-hover:text-teal group-focus-visible:text-teal"
              />
              <span className="truncate font-ui text-sm">{s.label}</span>
              <span
                aria-hidden
                className="ml-auto text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
