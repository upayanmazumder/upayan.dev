'use client';

import { useEffect, useState } from 'react';

import { BrandIcon } from '@/components/ui/brand-icon';

import { shortDuration } from './format';
import { LiveRow, Muted, Scramble } from './live-row';
import type { LivePc } from './types';

interface ZedRowProps {
  /** Editor activity rides on the signed PC report. */
  pc: LivePc | null | undefined;
  loading: boolean;
  /** Epoch ms when `pc` arrived; the session timer ticks forward from here. */
  receivedAt: number;
  index: number;
}

export function ZedRow({ pc, loading, receivedAt, index }: ZedRowProps) {
  const zed = pc?.online ? pc.zed : null;

  return (
    <LiveRow
      label="Zed"
      index={index}
      loading={loading}
      icon={<BrandIcon icon="siZedindustries" name="Zed" className={zed ? 'text-teal' : ''} />}
      meta={
        zed && pc ? (
          <Session activeSeconds={zed.activeSeconds} lastSeen={pc.lastSeen} since={receivedAt} />
        ) : null
      }
    >
      {!pc ? (
        <Muted>Unavailable</Muted>
      ) : !zed ? (
        <Muted>Idle</Muted>
      ) : (
        <p className="flex min-w-0 items-center">
          <Scramble text={zed.file} className="truncate font-mono text-[0.8rem]" />
          {/* A blinking caret: this file is open right now. */}
          <span
            aria-hidden
            className="mr-2 ml-0.5 inline-block h-3.5 w-[2px] shrink-0 animate-pulse bg-teal motion-reduce:animate-none"
          />
          <span className="truncate text-muted-foreground">{zed.workspace}</span>
        </p>
      )}
    </LiveRow>
  );
}

const TICK_MS = 15_000;

function Session({
  activeSeconds,
  lastSeen,
  since,
}: {
  activeSeconds: number;
  lastSeen: number;
  since: number;
}) {
  const [now, setNow] = useState(since);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, [since]);

  // `activeSeconds` was measured when the report was signed; add the time since then.
  return <>{shortDuration(activeSeconds + Math.max(0, now / 1000 - lastSeen))}</>;
}
