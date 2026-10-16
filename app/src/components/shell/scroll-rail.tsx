'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { usePathname } from 'next/navigation';

import { homeSections } from '@/components/nav/sections';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

import { useLenis } from './smooth-scroll';

const LABELS = new Map<string, string>([
  ['hero', 'Intro'],
  ...homeSections.map(s => [s.id, s.label] as const),
]);
const MIN_THUMB = 28;
const IDLE_MS = 900;

interface Mark {
  id: string;
  label: string;
  /** 0–1 position of the section start along the scroll range. */
  at: number;
}

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

/** Brightens the rail. Written to the DOM directly so scrolling never re-renders React. */
function markBusy(root: HTMLElement, busy: boolean) {
  const value = String(busy);
  if (root.dataset.busy !== value) root.dataset.busy = value;
}

function sameMarks(a: Mark[], b: Mark[]) {
  return (
    a.length === b.length &&
    a.every((mark, i) => mark.id === b[i]!.id && Math.abs(mark.at - b[i]!.at) < 0.001)
  );
}

/**
 * Custom scrollbar on the left edge; the right edge belongs to the liquid nav tab.
 * A teal thumb tracks progress and stretches with scroll velocity. Dots mark each section,
 * and a label beside the thumb names the section in view while scrolling. Drag the thumb,
 * or click the track or a dot, to move. Native scrollbars stay hidden in globals.css.
 */
export function ScrollRail() {
  const lenis = useLenis();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [scrollable, setScrollable] = useState(false);
  const dragging = useRef<{ offset: number } | null>(null);

  // Layout is measured on resize and cached, so a scroll frame only does arithmetic and a transform write.
  // React state changes only when the section in view or the measured marks actually change.
  useEffect(() => {
    const root = rootRef.current;
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!root || !rail || !thumb) return;
    const reduced = prefersReducedMotion();
    const setY = gsap.quickSetter(thumb, 'y', 'px');
    // Only the pill stretches; the label beside it keeps its shape.
    const pill = thumb.querySelector('[data-pill]');
    const stretch = gsap.quickTo(pill, 'scaleY', { duration: 0.4, ease: 'power3.out' });
    let max = 1;
    let track = 0;
    let size = MIN_THUMB;
    let sections: { id: string; top: number }[] = [];
    let current: string | null = null;
    let idle = 0;

    const update = (velocity = 0) => {
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      setY(progress * (track - size));
      if (!reduced) stretch(1 + Math.min(0.4, Math.abs(velocity) / 60));

      const probe = window.scrollY + window.innerHeight * 0.35;
      let next: string | null = null;
      for (const section of sections) if (section.top <= probe) next = section.id;
      if (next !== current) {
        current = next;
        setActive(next);
      }
    };

    const measure = () => {
      const doc = document.documentElement;
      max = maxScroll();
      track = rail.clientHeight;
      size = Math.max(MIN_THUMB, (track * window.innerHeight) / doc.scrollHeight);
      thumb.style.height = `${size}px`;
      sections = [...document.querySelectorAll<HTMLElement>('main section[id]')]
        .filter(el => LABELS.has(el.id))
        .map(el => ({ id: el.id, top: el.getBoundingClientRect().top + window.scrollY }));
      const nextMarks = sections.map(section => ({
        id: section.id,
        label: LABELS.get(section.id)!,
        at: Math.min(1, section.top / max),
      }));
      setMarks(previous => (sameMarks(previous, nextMarks) ? previous : nextMarks));
      setScrollable(doc.scrollHeight > window.innerHeight + 4);
      update();
    };

    const onScroll = (velocity = 0) => {
      update(velocity);
      markBusy(root, true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!dragging.current) markBusy(root, false);
        stretch(1);
      }, IDLE_MS);
    };
    const onLenis = (instance: { velocity: number }) => onScroll(instance.velocity);
    const onWindow = () => onScroll();

    measure();
    // Re-measure when the page height changes (expand, lazy content) or the viewport resizes.
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    if (lenis) lenis.on('scroll', onLenis);
    else window.addEventListener('scroll', onWindow, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      if (lenis) lenis.off('scroll', onLenis);
      else window.removeEventListener('scroll', onWindow);
      window.clearTimeout(idle);
    };
  }, [lenis, pathname]);

  const scrollToRatio = (ratio: number, immediate: boolean) => {
    const top = Math.min(1, Math.max(0, ratio)) * maxScroll();
    if (lenis) lenis.scrollTo(top, { immediate, duration: 1.2 });
    else window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  };

  const ratioAt = (clientY: number, offset: number) => {
    const rail = railRef.current!;
    const thumb = thumbRef.current!;
    const rect = rail.getBoundingClientRect();
    const span = rect.height - thumb.offsetHeight;
    return span > 0 ? (clientY - rect.top - offset) / span : 0;
  };

  const onThumbDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = { offset: event.clientY - event.currentTarget.getBoundingClientRect().top };
    if (rootRef.current) markBusy(rootRef.current, true);
  };
  const onThumbMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    scrollToRatio(ratioAt(event.clientY, dragging.current.offset), true);
  };
  const onThumbUp = () => {
    dragging.current = null;
    if (rootRef.current) markBusy(rootRef.current, false);
  };
  const onTrackDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const thumb = thumbRef.current!;
    scrollToRatio(ratioAt(event.clientY, thumb.offsetHeight / 2), false);
  };

  const activeLabel = marks.find(mark => mark.id === active)?.label;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        'group/rail fixed top-24 bottom-24 left-2 z-30 w-5 transition-opacity duration-500 max-lg:hidden pointer-coarse:pointer-events-none',
        scrollable ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <div
        ref={railRef}
        onPointerDown={onTrackDown}
        className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 cursor-pointer"
      >
        {/* Track: a hairline that brightens while scrolling or on hover. */}
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-transparent via-line-strong to-transparent opacity-40 transition-opacity duration-500 group-hover/rail:opacity-100 group-data-[busy=true]/rail:opacity-100" />

        {marks.map(mark => (
          <button
            key={mark.id}
            type="button"
            tabIndex={-1}
            title={mark.label}
            onPointerDown={event => {
              event.stopPropagation();
              scrollToRatio(mark.at, false);
            }}
            style={{ top: `${mark.at * 100}%` }}
            className="group/mark absolute left-1/2 flex size-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
          >
            <span
              className={cn(
                'size-1 rounded-full transition-[background-color,scale] duration-300 group-hover/mark:scale-150',
                mark.id === active ? 'scale-125 bg-teal' : 'bg-line-strong'
              )}
            />
            <span className="pointer-events-none absolute left-4 -translate-x-1 font-mono text-[0.625rem] whitespace-nowrap text-muted-foreground opacity-0 transition-[opacity,translate] duration-300 group-hover/mark:translate-x-0 group-hover/mark:opacity-100">
              {mark.label}
            </span>
          </button>
        ))}

        <div
          ref={thumbRef}
          onPointerDown={onThumbDown}
          onPointerMove={onThumbMove}
          onPointerUp={onThumbUp}
          onPointerCancel={onThumbUp}
          className="absolute top-0 left-1/2 w-5 origin-top -translate-x-1/2 cursor-grab touch-none active:cursor-grabbing"
          style={{ height: MIN_THUMB }}
        >
          <span
            data-pill
            className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-linear-to-b from-teal/40 via-teal to-teal/40 opacity-60 transition-[width,opacity,box-shadow] duration-500 group-hover/rail:w-[5px] group-hover/rail:opacity-100 group-data-[busy=true]/rail:opacity-100 group-data-[busy=true]/rail:shadow-[0_0_12px_var(--teal)]"
          />
          {activeLabel ? (
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-x-2 -translate-y-1/2 rounded-md border border-line bg-background/80 px-2 py-1 font-mono text-[0.625rem] whitespace-nowrap text-foreground opacity-0 backdrop-blur-md transition-[opacity,translate] duration-500 ease-out-expo group-data-[busy=true]/rail:translate-x-0 group-data-[busy=true]/rail:opacity-100 max-xl:hidden">
              <span className="text-teal">#</span> {activeLabel}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
