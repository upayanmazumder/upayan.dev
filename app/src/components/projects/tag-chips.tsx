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
            'rounded-md border border-line font-mono text-muted-foreground',
            size === 'xs' ? 'px-1.5 py-0.5 text-[0.6875rem]' : 'px-2 py-0.5 text-xs'
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
