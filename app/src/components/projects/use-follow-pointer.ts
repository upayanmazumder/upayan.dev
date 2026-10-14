'use client';

import type { FocusEvent, PointerEvent } from 'react';
import { useMotionValue, useSpring } from 'motion/react';

const spring = { stiffness: 380, damping: 32, mass: 0.6 };

/**
 * Spring-smoothed pointer position relative to the element handling the events.
 * Enter jumps to the pointer so the follower never flies in from a corner; keyboard focus centres it.
 */
export function useFollowPointer() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  const place = (target: Element, clientX: number, clientY: number, jump: boolean) => {
    const rect = target.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    rawX.set(px);
    rawY.set(py);
    if (jump) {
      x.jump(px);
      y.jump(py);
    }
  };

  return {
    x,
    y,
    handlers: {
      onPointerEnter: (event: PointerEvent<HTMLElement>) =>
        place(event.currentTarget, event.clientX, event.clientY, true),
      onPointerMove: (event: PointerEvent<HTMLElement>) =>
        place(event.currentTarget, event.clientX, event.clientY, false),
      onFocus: (event: FocusEvent<HTMLElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        place(event.currentTarget, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      },
    },
  };
}
