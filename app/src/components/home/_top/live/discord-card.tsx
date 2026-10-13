import { cn } from '@/lib/utils';

import { LiveCard, LiveSkeleton, Unavailable } from './live-card';
import type { DiscordStatus, LiveDiscord } from './types';

const STATUS: Record<DiscordStatus, { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-teal' },
  idle: { label: 'Idle', dot: 'bg-teal/40' },
  dnd: { label: 'Do not disturb', dot: 'bg-destructive' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground/50' },
};

interface DiscordCardProps {
  data: LiveDiscord | null | undefined;
  loading: boolean;
  className?: string;
}

export function DiscordCard({ data, loading, className }: DiscordCardProps) {
  const status = data ? STATUS[data.status] : null;

  return (
    <LiveCard label="Discord" className={className}>
      {loading ? (
        <LiveSkeleton />
      ) : !data || !status ? (
        <Unavailable what="Discord" />
      ) : (
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="flex items-center gap-2 font-ui font-semibold">
            <span aria-hidden className="relative flex size-2.5">
              {data.status === 'online' ? (
                <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-50 motion-reduce:animate-none" />
              ) : null}
              <span className={cn('relative size-2.5 rounded-full', status.dot)} />
            </span>
            {status.label}
          </p>
          {data.activity ? (
            <p className="text-sm text-muted-foreground">
              {data.activity.verb} <span className="text-foreground">{data.activity.name}</span>
              {data.activity.detail ? (
                <span className="block truncate text-xs">{data.activity.detail}</span>
              ) : null}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No activity.</p>
          )}
        </div>
      )}
    </LiveCard>
  );
}
