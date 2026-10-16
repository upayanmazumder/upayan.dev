import { BrandIcon } from '@/components/ui/brand-icon';
import { cn } from '@/lib/utils';

import { LiveDot, LiveTile, TileSkeleton, TileUnavailable } from './live-tile';
import type { DiscordStatus, LiveDiscord } from './types';

const STATUS: Record<DiscordStatus, { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-teal' },
  idle: { label: 'Idle', dot: 'bg-amber-400' },
  dnd: { label: 'Do not disturb', dot: 'bg-destructive' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground/50' },
};

interface DiscordTileProps {
  data: LiveDiscord | null | undefined;
  loading: boolean;
  className?: string;
}

export function DiscordTile({ data, loading, className }: DiscordTileProps) {
  const status = data ? STATUS[data.status] : null;

  return (
    <LiveTile
      label="Discord"
      icon={<BrandIcon icon="siDiscord" name="Discord" className="size-3.5" />}
      className={className}
    >
      {loading ? (
        <TileSkeleton />
      ) : !data || !status ? (
        <TileUnavailable what="Discord" />
      ) : (
        <div className="flex min-w-0 flex-col gap-1">
          <p className="flex items-center gap-2 text-lg font-medium">
            {data.status === 'online' ? (
              <LiveDot />
            ) : (
              <span aria-hidden className={cn('size-2 shrink-0 rounded-full', status.dot)} />
            )}
            {status.label}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {data.activity ? (
              <>
                {data.activity.verb} <span className="text-foreground">{data.activity.name}</span>
              </>
            ) : (
              'No activity'
            )}
          </p>
        </div>
      )}
    </LiveTile>
  );
}
