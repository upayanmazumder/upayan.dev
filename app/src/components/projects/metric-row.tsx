import CountUp from '@/components/rb/CountUp';
import type { Metric } from '@/data/types';
import { cn } from '@/lib/utils';

interface MetricRowProps {
  metrics: Metric[];
  className?: string;
  size?: 'md' | 'lg';
}

/** Big mono numbers that count up when visible. Renders nothing without metrics. */
export function MetricRow({ metrics, className, size = 'md' }: MetricRowProps) {
  if (metrics.length === 0) return null;
  return (
    <dl className={cn('flex flex-wrap gap-x-10 gap-y-4', className)}>
      {metrics.map(metric => (
        <div key={metric.label} className="flex flex-col gap-1">
          <dt className="sr-only">{metric.label}</dt>
          <dd
            className={cn(
              'font-mono leading-none font-medium tracking-tight text-foreground tabular-nums',
              size === 'lg' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
            )}
          >
            <span className="sr-only">
              {metric.value}
              {metric.suffix}
            </span>
            <span aria-hidden>
              <CountUp to={metric.value} duration={1} />
              {metric.suffix ? <span className="text-teal">{metric.suffix}</span> : null}
            </span>
          </dd>
          <dd aria-hidden className="max-w-44 text-xs text-muted-foreground">
            {metric.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
