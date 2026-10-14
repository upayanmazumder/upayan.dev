'use client';

import { useRef } from 'react';

import { BrandIcon } from '@/components/ui/brand-icon';
import { gsap, useGSAP } from '@/lib/gsap';
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
        <div className="mt-auto flex items-center gap-4">
          <Orb dot={status.dot} ring={status.ring} pulse={data.status !== 'offline'} />
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

/** Status dot with rings that ripple outward while the account is active. */
function Orb({ dot, ring, pulse }: { dot: string; ring: string; pulse: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!pulse) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-ring]',
          { scale: 0.6, autoAlpha: 0.7 },
          { scale: 1.8, autoAlpha: 0, duration: 2.4, ease: 'power2.out', stagger: 0.8, repeat: -1 }
        );
      });
    },
    { scope: ref, dependencies: [pulse], revertOnUpdate: true }
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className="relative ml-2 flex size-10 shrink-0 items-center justify-center"
    >
      {[0, 1, 2].map(i => (
        <span
          key={i}
          data-ring
          className={cn('absolute inset-0 rounded-full border opacity-0', ring)}
        />
      ))}
      <span className={cn('relative size-4 rounded-full shadow-[0_0_16px_currentColor]', dot)} />
    </span>
  );
}
