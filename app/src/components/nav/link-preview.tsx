'use client';

import Image from 'next/image';
import { AnimatePresence, m, type MotionValue } from 'motion/react';

import { EASE } from '@/lib/motion';

interface LinkPreviewProps {
  src?: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/** Floating image card that trails the pointer; images crossfade as the hovered link changes. Hover devices only. */
export function LinkPreview({ src, x, y }: LinkPreviewProps) {
  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-10 hidden [@media(hover:hover)]:block"
      style={{ x, y }}
    >
      <AnimatePresence>
        {src && (
          <m.div
            key="card"
            className="relative ml-8 aspect-4/3 w-64 -translate-y-1/2 overflow-hidden rounded-xl border border-line-strong bg-surface-2 shadow-2xl shadow-black/60"
            initial={{ opacity: 0, scale: 0.86, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            <AnimatePresence initial={false}>
              <m.div
                key={src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE.out }}
              >
                <Image src={encodeURI(src)} alt="" fill sizes="256px" className="object-cover" />
              </m.div>
            </AnimatePresence>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
