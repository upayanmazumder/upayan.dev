'use client';

import { useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap';

// Module state survives template remounts: tells the first load apart from navigation, and keeps a pending wipe
// alive across Strict Mode's mount, revert, and remount until it actually finishes.
let lastPathname: string | null = null;
let pendingWipe: string | null = null;

/** Route transition: a clip-path wipe with a teal hairline edge reveals the new page from the bottom up. */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pageRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (lastPathname !== null && lastPathname !== pathname) pendingWipe = pathname;
      lastPathname = pathname;
      const page = pageRef.current;
      if (pendingWipe !== pathname || !page || prefersReducedMotion()) return;

      // Clip in page coordinates so the wipe covers the viewport even when navigation lands mid-page on a hash.
      const height = window.innerHeight;
      const scrolled = Math.max(0, -page.getBoundingClientRect().top);
      gsap
        .timeline({
          defaults: { duration: 0.45, ease: 'power3.inOut' },
          onComplete: () => {
            pendingWipe = null;
          },
        })
        .fromTo(
          page,
          { clipPath: `inset(${scrolled + height}px 0px 0px 0px)` },
          { clipPath: `inset(${scrolled}px 0px 0px 0px)`, clearProps: 'clipPath' }
        )
        .fromTo(edgeRef.current, { y: height, autoAlpha: 1 }, { y: 0 }, 0)
        .to(edgeRef.current, { autoAlpha: 0, duration: 0.15, ease: 'power1.out' });
    },
    { dependencies: [pathname] }
  );

  return (
    <>
      <div ref={pageRef}>{children}</div>
      <div
        ref={edgeRef}
        aria-hidden
        className="pointer-events-none invisible fixed inset-x-0 top-0 z-30 h-px bg-teal/80 shadow-[0_0_10px_var(--teal-dim)]"
      />
    </>
  );
}
