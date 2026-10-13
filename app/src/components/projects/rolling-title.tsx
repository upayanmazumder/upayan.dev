import type { ElementType } from 'react';

import { cn } from '@/lib/utils';

interface RollingTitleProps {
  text: string;
  as?: ElementType;
  className?: string;
}

/**
 * Letters roll up to a teal copy, staggered, when an ancestor `.group` is hovered or holds focus.
 * Screen readers get the plain text once.
 */
export function RollingTitle({ text, as: Tag = 'h3', className }: RollingTitleProps) {
  return (
    <Tag className={cn('relative', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex overflow-hidden leading-[1.2]">
        {Array.from(text).map((char, i) => (
          <span
            key={`${char}-${i}`}
            style={{ transitionDelay: `${i * 22}ms` }}
            className="relative inline-block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full group-has-[:focus-visible]:-translate-y-full motion-reduce:transition-none"
          >
            <span className="block whitespace-pre">{char}</span>
            <span className="absolute top-full left-0 block whitespace-pre text-teal">{char}</span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
