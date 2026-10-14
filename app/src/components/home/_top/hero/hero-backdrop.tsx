'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

import { useReducedMotion } from '../use-reduced-motion';

const Aurora = dynamic(() => import('./aurora').then(mod => mod.Aurora), { ssr: false });

// Radial focus near the name, then a long fade into the page so the shader never ends on a hard edge.
const MASK =
  'radial-gradient(120% 85% at 50% 30%, black 25%, transparent 78%), linear-gradient(to bottom, black 55%, transparent)';

/**
 * Teal aurora shader behind the hero only. Fades and blurs out on scroll, pauses offscreen.
 * Reduced motion keeps just the static glow.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const root = ref.current;
      const shader = shaderRef.current;
      const hero = root?.parentElement;
      if (!root || !shader || !hero) return;

      gsap.fromTo(
        shader,
        { autoAlpha: 0.85, filter: 'blur(0px)' },
        {
          autoAlpha: 0,
          filter: 'blur(16px)',
          scale: 1.06,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        }
      );
      ScrollTrigger.create({
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: self => setPaused(!self.isActive),
      });
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
      {reduced ? null : (
        <div
          ref={shaderRef}
          className="absolute inset-0 will-change-[opacity,filter]"
          style={{
            maskImage: MASK,
            WebkitMaskImage: MASK,
            maskComposite: 'intersect',
          }}
        >
          <Aurora base="#0a1716" sheen="#5fd4b4" paused={paused} className="h-full w-full" />
        </div>
      )}
    </div>
  );
}
