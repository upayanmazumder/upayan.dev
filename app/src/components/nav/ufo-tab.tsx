'use client';

import { useRef, type RefObject } from 'react';

import { Saucer } from '@/components/space';
import { cn } from '@/lib/utils';

import { preloadMenu } from './lazy-overlays';
import { Preloader } from './preloader';
import { useArrival } from './use-arrival';
import { useUfoPointer } from './use-ufo-pointer';

interface UfoTabProps {
  open: boolean;
  /** Id of the menu panel, while it is mounted. */
  controls?: string;
  onToggle: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The menu button is a saucer peeking in over the top-centre edge, its dome just off-screen. On a
 * full load it is the preloader's centrepiece and flies up here. It bobs while idle, leans out toward
 * a cursor in the top of the screen, and now and then shoots at it. Opening the menu brings it down
 * to hover with its beam on, and the menu panel opens out of that beam.
 */
export function UfoTab({ open, controls, onToggle, buttonRef }: UfoTabProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const leanRef = useRef<HTMLSpanElement>(null);
  const pelletsRef = useRef<HTMLDivElement>(null);
  useArrival(buttonRef, overlayRef);
  useUfoPointer(buttonRef, leanRef, pelletsRef, open);

  return (
    <>
      <Preloader ref={overlayRef} />
      <div
        ref={pelletsRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59] overflow-hidden"
      />
      <button
        ref={buttonRef}
        type="button"
        data-ufo-tab
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls={controls}
        onClick={onToggle}
        onPointerEnter={preloadMenu}
        onFocus={preloadMenu}
        className="group/ufo fixed top-(--ufo-top) left-[calc(50%-2rem)] z-60 flex h-11 w-16 cursor-pointer items-center justify-center rounded-full outline-offset-4 data-[arrival=true]:z-[90]"
      >
        <span ref={leanRef} className="block w-full">
          {/* `MenuPanel` lowers and grows this in step with the hologram, so open and close stay in order. */}
          <span
            data-ufo-body
            className={cn(
              'relative block w-full transition-[translate] duration-500 ease-out-expo',
              !open && 'group-hover/ufo:translate-y-2'
            )}
          >
            <span className="block animate-[ufo-float_3.2s_ease-in-out_infinite] motion-reduce:animate-none">
              {/* Provoked: a red tint and a jitter until it fires back or is clicked. */}
              <span className="block transition-[filter] duration-300 group-data-[angry=true]/ufo:animate-[ufo-angry_0.16s_linear_infinite] group-data-[angry=true]/ufo:[filter:hue-rotate(210deg)_saturate(1.8)]">
                <Saucer className="w-full drop-shadow-[0_0_10px_var(--teal-dim)] transition-[filter] group-hover/ufo:drop-shadow-[0_0_14px_var(--teal)]" />
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                'absolute top-[70%] left-1/2 h-10 w-12 origin-top -translate-x-1/2 bg-linear-to-b from-teal/50 to-transparent transition-[scale,opacity] duration-300 [clip-path:polygon(35%_0,65%_0,100%_100%,0_100%)]',
                // Open: the menu hologram is the beam, so this small cone steps aside for it.
                open
                  ? 'scale-y-0 opacity-0'
                  : 'scale-y-0 opacity-0 group-hover/ufo:scale-y-50 group-hover/ufo:opacity-60'
              )}
            />
          </span>
        </span>
      </button>
    </>
  );
}
