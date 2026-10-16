import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { stack } from '@/data/stack';

export function Stack() {
  return (
    <Section id="stack" title="Stack" lead="The tools I reach for.">
      <div className="divide-y divide-line border-y border-line">
        {stack.map(group => (
          <div key={group.label} className="grid gap-3 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
            <h3 className="label pt-0.5">{group.label}</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {group.items.map(item => (
                <li key={item.name} className="inline-flex items-center gap-2 text-sm">
                  <BrandIcon
                    icon={item.icon}
                    name={item.name}
                    className="size-3.5 text-muted-foreground"
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
