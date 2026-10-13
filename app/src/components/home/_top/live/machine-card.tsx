import { formatDistanceToNowStrict } from 'date-fns';

import { cn } from '@/lib/utils';

import { LiveCard, LiveSkeleton, Unavailable } from './live-card';
import type { LivePc } from './types';

interface MachineCardProps {
  data: LivePc | null | undefined;
  loading: boolean;
  className?: string;
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

const GIB = 1024 ** 3;

export function MachineCard({ data, loading, className }: MachineCardProps) {
  return (
    <LiveCard
      label="Machine"
      aside={data ? data.online ? <span className="text-teal">Online</span> : 'Offline' : null}
      className={className}
    >
      {loading ? (
        <LiveSkeleton />
      ) : !data ? (
        <Unavailable what="My machine" />
      ) : (
        <div
          className={cn('flex flex-1 flex-col justify-center gap-3', !data.online && 'opacity-60')}
        >
          <p className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-muted-foreground">
              {data.online
                ? 'Up for'
                : `Last report ${formatDistanceToNowStrict(data.lastSeen * 1000, { addSuffix: true })}`}
            </span>
            {data.online ? (
              <span className="font-mono text-lg text-foreground tabular-nums">
                {formatUptime(data.uptimeSeconds)}
              </span>
            ) : null}
          </p>
          <Meter
            label="CPU"
            value={data.cpuPercent / 100}
            text={`${Math.round(data.cpuPercent)}%`}
          />
          <Meter
            label="Memory"
            value={data.memory.total ? data.memory.used / data.memory.total : 0}
            text={`${(data.memory.used / GIB).toFixed(1)} / ${(data.memory.total / GIB).toFixed(0)} GB`}
          />
        </div>
      )}
    </LiveCard>
  );
}

function Meter({ label, value, text }: { label: string; value: number; text: string }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between font-mono text-[0.7rem] text-muted-foreground tabular-nums">
        <span>{label}</span>
        <span>{text}</span>
      </div>
      <span
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        className="relative h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="absolute inset-0 origin-left bg-teal/80 transition-transform duration-700 ease-out-expo"
          style={{ transform: `scaleX(${clamped})` }}
        />
      </span>
    </div>
  );
}
