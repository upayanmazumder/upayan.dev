'use client';

import { useEffect, useState } from 'react';

import { Decrypt } from './decrypt';

const ROTATE_MS = 4000;

/** Cycles through the "currently" lines with a decrypt swap. Screen readers get the full list once. */
export function Currently({ items }: { items: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setIndex(i => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [items.length]);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground md:text-base">
      <span className="label text-teal">Currently</span>
      <span className="sr-only">{items.join('; ')}</span>
      <span aria-hidden className="font-medium text-foreground">
        <Decrypt key={index} text={items[index] ?? ''} />
      </span>
    </p>
  );
}
