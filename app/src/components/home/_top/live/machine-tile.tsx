'use client';

import { Cpu } from 'lucide-react';

import { cn } from '@/lib/utils';

import { shortDuration } from './format';
import { LiveTile, TileSkeleton, TileUnavailable } from './live-tile';
import type { LivePc } from './types';
import { useNow } from './use-now';

const GIB = 1024 ** 3;

/** Installed RAM is a power of two; the OS reports less because the iGPU reserves some. */
function physicalRamGib(totalBytes: number): number {
  const gib = totalBytes / GIB;
  return gib > 0 ? 2 ** Math.ceil(Math.log2(gib)) : 0;
}

interface MachineTileProps {
  data: LivePc | null | undefined;
  loading: boolean;
  /** Epoch ms when `data` arrived; uptime ticks forward from here. */
  receivedAt: number;
  className?: string;
}

export function MachineTile({ data, loading, receivedAt, className }: MachineTileProps) {
  const ramGib = data ? physicalRamGib(data.memory.total) : 0;
  const usedGib = data ? data.memory.used / GIB : 0;

  return (
    <LiveTile
      label="Machine"
      icon={<Cpu aria-hidden className="size-3.5" />}
      aside={
        data ? (
          data.online ? (
            <Uptime seconds={data.uptimeSeconds} since={receivedAt} />
          ) : (
            'offline'
          )
        ) : null
      }
      className={className}
    >
      {loading ? (
        <TileSkeleton />
      ) : !data ? (
        <TileUnavailable what="My machine" />
      ) : (
        <div className={cn('flex flex-col gap-4', !data.online && 'opacity-50')}>
          <Meter
            label="CPU"
            value={data.cpuPercent / 100}
            text={`${Math.round(data.cpuPercent)}%`}
          />
          <Meter
            label="RAM"
            value={ramGib ? usedGib / ramGib : 0}
            text={`${usedGib.toFixed(1)} of ${ramGib} GB`}
          />
        </div>
      )}
    </LiveTile>
  );
}

function Uptime({ seconds, since }: { seconds: number; since: number }) {
  const now = useNow(since, 30_000);
  return <span>up {shortDuration(seconds + (now - since) / 1000)}</span>;
}

/** Labelled reading over a thin static bar. */
function Meter({ label, value, text }: { label: string; value: number; text: string }) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{text}</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuetext={text}
        className="h-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div className="h-full bg-foreground/70" style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  );
}
