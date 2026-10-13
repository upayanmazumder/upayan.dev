import type { CSSProperties } from 'react';
import { Cpu } from 'lucide-react';

import { cn } from '@/lib/utils';

import { shortDuration } from './format';
import { LiveRow, Muted } from './live-row';
import type { LivePc } from './types';

const GIB = 1024 ** 3;

/** Installed RAM is a power of two; the OS reports less because the iGPU reserves some. */
function physicalRamGib(totalBytes: number): number {
  const gib = totalBytes / GIB;
  return gib > 0 ? 2 ** Math.ceil(Math.log2(gib)) : 0;
}

interface MachineRowProps {
  data: LivePc | null | undefined;
  loading: boolean;
  index: number;
}

export function MachineRow({ data, loading, index }: MachineRowProps) {
  const ramGib = data ? physicalRamGib(data.memory.total) : 0;

  return (
    <LiveRow
      label="Machine"
      index={index}
      loading={loading}
      icon={<Cpu aria-hidden className={cn('size-4', data?.online && 'text-teal')} />}
      meta={data ? (data.online ? `up ${shortDuration(data.uptimeSeconds)}` : 'offline') : null}
    >
      {!data ? (
        <Muted>Unavailable</Muted>
      ) : (
        <div className={cn('flex items-center gap-4', !data.online && 'opacity-50')}>
          <Gauge
            label="CPU"
            value={data.cpuPercent / 100}
            text={`${Math.round(data.cpuPercent)}%`}
          />
          <Gauge
            label="RAM"
            value={ramGib ? data.memory.used / (ramGib * GIB) : 0}
            text={`${(data.memory.used / GIB).toFixed(1)} / ${ramGib} GB`}
          />
        </div>
      )}
    </LiveRow>
  );
}

function Gauge({ label, value, text }: { label: string; value: number; text: string }) {
  const clamped = Math.min(1, Math.max(0, value));
  return (
    <span title={`${label} ${text}`} className="flex flex-1 items-center gap-2">
      <span className="font-mono text-[0.65rem] text-muted-foreground">{label}</span>
      <span
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuetext={text}
        className="relative h-1 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <span
          className="absolute inset-0 origin-left scale-x-0 rounded-full bg-linear-to-r from-teal/50 to-teal shadow-[0_0_8px_var(--teal)] transition-[scale] delay-[calc(var(--i)*140ms+300ms)] duration-1000 ease-out-expo in-data-[shown=true]:scale-x-(--v) motion-reduce:transition-none"
          style={{ '--v': clamped } as CSSProperties}
        />
      </span>
    </span>
  );
}
