'use client';

import { useRef } from 'react';
import { Cpu } from 'lucide-react';

import Counter from '@/components/rb/Counter';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { shortDuration } from './format';
import { LiveTile, TileSkeleton, TileUnavailable } from './live-tile';
import type { LivePc } from './types';
import { useNow } from './use-now';

const GIB = 1024 ** 3;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
        <div
          className={cn(
            'flex items-center justify-around gap-3',
            !data.online && 'opacity-50 grayscale'
          )}
        >
          <Ring label="CPU" value={data.cpuPercent / 100} text={`${Math.round(data.cpuPercent)}%`}>
            <Counter
              value={Math.round(data.cpuPercent)}
              places={data.cpuPercent >= 9.5 ? [10, 1] : [1]}
              fontSize={15}
              gap={0}
              horizontalPadding={0}
              gradientHeight={0}
              fontWeight={600}
            />
            <span className="text-[0.6rem] text-muted-foreground">%</span>
          </Ring>
          <Ring
            label="RAM"
            value={ramGib ? usedGib / ramGib : 0}
            text={`${usedGib.toFixed(1)} of ${ramGib} GB`}
          >
            <Counter
              value={Math.round(usedGib * 10) / 10}
              places={usedGib >= 9.95 ? [10, 1, '.', 0.1] : [1, '.', 0.1]}
              fontSize={13}
              gap={0}
              horizontalPadding={0}
              gradientHeight={0}
              fontWeight={600}
            />
            <span className="text-[0.55rem] text-muted-foreground">/{ramGib}G</span>
          </Ring>
        </div>
      )}
    </LiveTile>
  );
}

function Uptime({ seconds, since }: { seconds: number; since: number }) {
  const now = useNow(since, 30_000);
  return <span>up {shortDuration(seconds + (now - since) / 1000)}</span>;
}

/** Radial gauge. The arc sweeps to each new reading with GSAP. */
function Ring({
  label,
  value,
  text,
  children,
}: {
  label: string;
  value: number;
  text: string;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const clamped = Math.min(1, Math.max(0, value));

  useGSAP(
    () => {
      gsap.to(ref.current, {
        strokeDashoffset: CIRCUMFERENCE * (1 - clamped),
        duration: 1.4,
        ease: 'expo.out',
      });
    },
    { dependencies: [clamped] }
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuetext={text}
        className="relative size-16"
      >
        <svg viewBox="0 0 64 64" className="size-full -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={RADIUS}
            className="fill-none stroke-surface-2"
            strokeWidth={5}
          />
          <circle
            ref={ref}
            cx="32"
            cy="32"
            r={RADIUS}
            className="fill-none stroke-teal drop-shadow-[0_0_4px_var(--teal)]"
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center gap-px font-mono text-foreground"
        >
          {children}
        </span>
      </div>
      <span className="font-mono text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}
