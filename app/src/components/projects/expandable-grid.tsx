'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';

import { Reveal } from '@/components/shell/reveal';
import { useLenis } from '@/components/shell/smooth-scroll';
import { ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface ExpandableGridProps {
  /** Server-rendered cards, keyed by id. */
  items: { id: string; node: ReactNode }[];
  initial?: number;
}

/** Two-column grid that shows `initial` items and expands with a layout animation. */
export function ExpandableGrid({ items, initial = 8 }: ExpandableGridProps) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const visible = expanded ? items : items.slice(0, initial);

  const toggle = () => {
    if (expanded && root.current) {
      const top = root.current.getBoundingClientRect().top;
      if (top < 0) {
        if (lenis) lenis.scrollTo(root.current, { offset: -96, immediate: true });
        else root.current.scrollIntoView({ block: 'start' });
      }
    }
    // Page height changes; later sections' triggers must re-measure. Collapse refreshes after exits finish.
    if (!expanded) requestAnimationFrame(() => ScrollTrigger.refresh());
    setExpanded(!expanded);
  };

  return (
    <div ref={root} className="flex flex-col gap-4">
      <LayoutGroup>
        <Reveal as="ul" className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <AnimatePresence initial={false} onExitComplete={() => ScrollTrigger.refresh()}>
            {visible.map((item, i) => (
              <m.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.18 } }}
                transition={{
                  layout: { type: 'spring', stiffness: 260, damping: 30 },
                  default: {
                    duration: 0.5,
                    delay: i >= initial ? (i - initial) * 0.04 : 0,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
              >
                <div data-reveal={i < initial ? '' : undefined} className="h-full">
                  {item.node}
                </div>
              </m.li>
            ))}
          </AnimatePresence>
        </Reveal>
        {items.length > initial ? (
          <m.div layout className="flex justify-center">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-ui text-xs font-medium text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
            >
              {expanded ? 'Show less' : `Show all ${items.length}`}
              <ChevronDown
                aria-hidden
                className={cn(
                  'size-3.5 transition-transform duration-300',
                  expanded && 'rotate-180'
                )}
              />
            </button>
          </m.div>
        ) : null}
      </LayoutGroup>
    </div>
  );
}
