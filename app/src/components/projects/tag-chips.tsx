import { cn } from '@/lib/utils';

interface TagChipsProps {
  items: string[];
  className?: string;
  size?: 'xs' | 'sm';
  label?: string;
}

export function TagChips({ items, className, size = 'sm', label = 'Stack' }: TagChipsProps) {
  if (items.length === 0) return null;
  return (
    <ul aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map(item => (
        <li
          key={item}
          className={cn(
            'rounded-full border border-line bg-surface-2/60 font-ui text-muted-foreground',
            size === 'xs' ? 'px-2 py-0.5 text-[0.625rem]' : 'px-2.5 py-1 text-xs'
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
