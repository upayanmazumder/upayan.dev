'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';

import { useActive } from '@/hooks/use-active';

import { Decrypt } from './decrypt';

const ROTATE_MS = 5000;

/**
 * Cycles through the "currently" lines while the hero is on screen. The first line decrypts once
 * with the intro; later swaps are a short fade. Screen readers get the full list once.
 */
export function Currently({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const active = useActive(ref);
  // Counts every swap; the item is `step % items.length`, and only step 0 decrypts.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active || items.length < 2) return;
    const id = window.setInterval(() => setStep(s => s + 1), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [active, items.length]);

  const text = items[step % Math.max(items.length, 1)] ?? '';

  return (
    <p
      ref={ref}
      className="flex flex-wrap items-baseline gap-x-2 text-sm text-muted-foreground md:text-base"
    >
      <span className="label text-accent-foreground!">Currently</span>
      <span className="sr-only">{items.join('; ')}</span>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={step}
          aria-hidden
          className="font-medium text-foreground"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {step === 0 ? <Decrypt text={text} /> : text}
        </m.span>
      </AnimatePresence>
    </p>
  );
}
