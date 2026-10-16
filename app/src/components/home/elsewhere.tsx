import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { otherSocials } from '@/data/profile';

export function Elsewhere() {
  return (
    <Section id="elsewhere" title="Elsewhere">
      <ul className="grid grid-cols-1 gap-x-8 min-[440px]:grid-cols-2 sm:grid-cols-3">
        {otherSocials.map(s => (
          <li key={s.id} className="border-b border-line">
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 py-3 text-sm transition-colors hover:text-teal focus-visible:text-teal"
            >
              <BrandIcon icon={s.icon} name={s.label} className="size-4 text-muted-foreground" />
              <span className="truncate">{s.label}</span>
              <span
                aria-hidden
                className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
