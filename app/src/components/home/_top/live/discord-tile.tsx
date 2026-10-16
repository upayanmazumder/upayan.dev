import { BrandIcon } from '@/components/ui/brand-icon';
import { cn } from '@/lib/utils';

import { LiveTile, Scramble, TileSkeleton, TileUnavailable } from './live-tile';
import type { DiscordStatus, LiveDiscord } from './types';

const STATUS: Record<DiscordStatus, { label: string; dot: string; ring: string }> = {
  online: { label: 'Online', dot: 'bg-teal', ring: 'border-teal' },
  idle: { label: 'Idle', dot: 'bg-amber-400', ring: 'border-amber-400' },
  dnd: { label: 'Do not disturb', dot: 'bg-destructive', ring: 'border-destructive' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground/50', ring: 'border-transparent' },
};

interface DiscordTileProps {
  data: LiveDiscord | null | undefined;
  loading: boolean;
  /** Panel on screen and tab visible; the status ripple runs only then. */
  active: boolean;
  className?: string;
}

export function DiscordTile({ data, loading, active, className }: DiscordTileProps) {
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
        <div className="mt-auto flex items-center gap-4">
          <Orb dot={status.dot} ring={status.ring} pulse={data.status !== 'offline' && active} />
          <div className="flex min-w-0 flex-col gap-0.5">
            <Scramble text={status.label} className="font-ui text-lg font-semibold" />
            <p className="truncate text-xs text-muted-foreground">
              {data.activity ? (
                <>
                  {data.activity.verb}{' '}
                  <span className="text-foreground/85">{data.activity.name}</span>
                </>
              ) : (
                'No activity'
              )}
            </p>
          </div>
        </div>
      )}
    </LiveTile>
  );
}

/** Status dot with one slow ripple while the account is active. A compositor-only CSS ping. */
function Orb({ dot, ring, pulse }: { dot: string; ring: string; pulse: boolean }) {
  return (
    <span aria-hidden className="relative ml-2 flex size-10 shrink-0 items-center justify-center">
      {pulse ? (
        <span
          className={cn(
            'absolute inset-1 animate-ping rounded-full border opacity-60 [animation-duration:2.8s] motion-reduce:hidden',
            ring
          )}
        />
      ) : null}
      <span className={cn('relative size-4 rounded-full shadow-[0_0_12px_currentColor]', dot)} />
    </span>
  );
}
