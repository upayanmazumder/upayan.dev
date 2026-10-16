'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, m, useMotionValueEvent, type MotionValue } from 'motion/react';

import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface LinkPreviewProps {
  /** Image per link, by index. */
  sources: (string | undefined)[];
  /** Index of the hovered or focused link, -1 for none. */
  active: MotionValue<number>;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/** Floating image card that trails the pointer; images crossfade as the hovered link changes. Hover devices only. */
export function LinkPreview({ sources, active, x, y }: LinkPreviewProps) {
  // Subscribed here so a hover change re-renders this card, not the link list.
  const [index, setIndex] = useState(-1);
  useMotionValueEvent(active, 'change', setIndex);
  const src = sources[index];
  const isGraphic =
    src && (src.includes('/clubs/') || src.includes('/projects/') || src.includes('/services/'));
  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-60 hidden [@media(hover:hover)]:block"
      style={{ x, y }}
    >
      <AnimatePresence>
        {src && (
          <m.div
            key="card"
            className="relative ml-8 aspect-4/3 w-64 -translate-y-1/2 overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-2xl shadow-black/60"
            initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE.out }}
          >
            <AnimatePresence initial={false}>
              <m.div
                key={src}
                className={cn('absolute inset-0', isGraphic && 'p-6')}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE.out }}
              >
                <Image
                  src={encodeURI(src)}
                  alt=""
                  fill
                  sizes="256px"
                  className={isGraphic ? 'object-contain' : 'object-cover'}
                />
              </m.div>
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
