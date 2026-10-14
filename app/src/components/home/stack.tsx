import LogoLoop from '@/components/rb/LogoLoop';
import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { BrandIcon } from '@/components/ui/brand-icon';
import { stack } from '@/data/stack';

// One marquee entry per distinct brand glyph; items without an icon only appear as chips.
const marquee = [
  ...new Map(
    stack
      .flatMap(group => group.items)
      .flatMap(item => (item.icon ? [[item.icon, item] as const] : []))
  ).values(),
].map(item => ({
  node: (
    <BrandIcon
      icon={item.icon}
      name={item.name}
      className="size-6 text-muted-foreground/70 transition-colors duration-300 hover:text-teal"
    />
  ),
  title: item.name,
}));

export function Stack() {
  return (
    <Section id="stack" index="05" title="Stack" lead="The tools I reach for.">
      <div aria-hidden className="mb-10">
        <LogoLoop
          logos={marquee}
          speed={28}
          logoHeight={24}
          gap={40}
          pauseOnHover
          fadeOut
          fadeOutColor="var(--background)"
          ariaLabel="Stack logos"
        />
      </div>
      <div className="flex flex-col gap-8">
        {stack.map(group => (
          <Reveal key={group.label} stagger={0.035} className="flex flex-col gap-3">
            <h3 data-reveal className="label">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map(item => (
                <li
                  key={item.name}
                  data-reveal
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 font-ui text-sm text-foreground/90 transition-[border-color,color,box-shadow] duration-300 hover:border-teal/40 hover:text-foreground hover:shadow-[0_0_20px_-6px_var(--teal)]"
                >
                  <BrandIcon
                    icon={item.icon}
                    name={item.name}
                    className="size-4 text-muted-foreground"
                  />
                  {item.name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
