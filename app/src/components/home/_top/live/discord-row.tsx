import { BrandIcon } from '@/components/ui/brand-icon';
import { cn } from '@/lib/utils';

import { LiveRow, Muted } from './live-row';
import type { DiscordStatus, LiveDiscord } from './types';

const STATUS: Record<DiscordStatus, { label: string; dot: string }> = {
  online: { label: 'Online', dot: 'bg-teal' },
  idle: { label: 'Idle', dot: 'bg-teal/40' },
  dnd: { label: 'Do not disturb', dot: 'bg-destructive' },
  offline: { label: 'Offline', dot: 'bg-muted-foreground/50' },
};

interface DiscordRowProps {
  data: LiveDiscord | null | undefined;
  loading: boolean;
  index: number;
}

export function DiscordRow({ data, loading, index }: DiscordRowProps) {
  const status = data ? STATUS[data.status] : null;

  return (
    <LiveRow
      label="Discord"
      index={index}
      loading={loading}
      icon={<BrandIcon icon="siDiscord" name="Discord" />}
      meta={
        status ? (
          <span aria-hidden className="relative flex size-2">
            {data?.status === 'online' ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-teal opacity-50 motion-reduce:animate-none" />
            ) : null}
            <span className={cn('relative size-2 rounded-full', status.dot)} />
          </span>
        ) : null
      }
    >
      {!data || !status ? (
        <Muted>Unavailable</Muted>
      ) : (
        <p className="truncate">
          <span className="font-ui font-medium">{status.label}</span>
          {data.activity ? (
            <span className="text-muted-foreground">
              {' '}
              · {data.activity.verb} {data.activity.name}
            </span>
          ) : null}
        </p>
      )}
    </LiveRow>
  );
}
