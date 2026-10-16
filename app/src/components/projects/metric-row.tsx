import type { Metric } from '@/data/types';
import { cn } from '@/lib/utils';

interface MetricRowProps {
  metrics: Metric[];
  className?: string;
  size?: 'md' | 'lg';
}

/** Static figures with their labels. Renders nothing without metrics. */
export function MetricRow({ metrics, className, size = 'md' }: MetricRowProps) {
  if (metrics.length === 0) return null;
  return (
    <dl className={cn('flex flex-wrap gap-x-10 gap-y-4', className)}>
      {metrics.map(metric => (
        <div key={metric.label} className="flex flex-col-reverse gap-1">
          <dt className="max-w-44 text-xs text-muted-foreground">{metric.label}</dt>
          <dd
            className={cn(
              'leading-none font-semibold tracking-tight text-foreground tabular-nums',
              size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl'
            )}
          >
            {metric.value}
            {metric.suffix}
          </dd>
        </div>
      ))}
    </dl>
  );
}
