'use client';

import type { ReactNode } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';

const spring = { stiffness: 220, damping: 22, mass: 0.6 };

/** Subtle pointer-driven 3D tilt. Mouse only, so touch and keyboard see a flat card. */
export function Tilt({
  children,
  className,
  amplitude = 4,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [amplitude, -amplitude]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-amplitude, amplitude]), spring);

  return (
    <div className={cn('[perspective:900px]', className)}>
      <m.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={e => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        className="h-full"
      >
        {children}
      </m.div>
    </div>
  );
}
