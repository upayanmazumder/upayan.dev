'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';

import { useActive } from '@/hooks/use-active';
import { gsap, useGSAP } from '@/lib/gsap';

import { useReducedMotion } from '../use-reduced-motion';

const Aurora = dynamic(() => import('./aurora').then(mod => mod.Aurora), { ssr: false });

// Radial focus near the name, then a long fade into the page so the shader never ends on a hard edge.
const MASK =
  'radial-gradient(120% 85% at 50% 30%, black 25%, transparent 78%), linear-gradient(to bottom, black 55%, transparent)';

/**
 * Teal aurora shader behind the hero only. Fades out on scroll; the shader runs only while the
 * hero is on screen and the tab is visible. Reduced motion keeps just the static glow.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const active = useActive(ref, '0px');

  useGSAP(
    () => {
      const shader = shaderRef.current;
      const hero = ref.current?.parentElement;
      if (!shader || !hero) return;

      // Opacity and transform only: a scrubbed blur over a full-viewport canvas repaints every frame.
      gsap.fromTo(
        shader,
        { autoAlpha: 0.85 },
        {
          autoAlpha: 0,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        }
      );
    },
    { scope: ref, dependencies: [reduced], revertOnUpdate: true }
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_28%,var(--teal-dim),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_35%_at_88%_12%,var(--accent),transparent_72%)]" />
      {reduced ? null : (
        <div
          ref={shaderRef}
          className="absolute inset-0 will-change-[opacity,transform]"
          style={{
            maskImage: MASK,
            WebkitMaskImage: MASK,
            maskComposite: 'intersect',
          }}
        >
          <Aurora base="#091510" sheen="#66ff99" paused={!active} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
