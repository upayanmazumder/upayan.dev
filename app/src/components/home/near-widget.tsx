'use client';

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

interface NearWidgetProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  as?: 'div' | 'span';
}

/** Keep server content in place until the enhancement's chunk is needed near the viewport. */
export function NearWidget({ children, fallback, className, as = 'div' }: NearWidgetProps) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || ready) return;
    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: '350px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ready]);

  const content = ready ? <Suspense fallback={fallback}>{children}</Suspense> : fallback;
  if (as === 'span')
    return (
      <span
        ref={node => {
          ref.current = node;
        }}
        className={className}
      >
        {content}
      </span>
    );
  return (
    <div
      ref={node => {
        ref.current = node;
      }}
      className={className}
    >
      {content}
    </div>
  );
}
