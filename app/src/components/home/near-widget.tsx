'use client';

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/** Fallback renderer when an imported chunk or lazy component fails to load. */
class WidgetErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
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

    let focusCleanup: (() => void) | undefined;

    const activate = () => {
      // If a fallback link or control is currently focused, defer replacement until focus moves away.
      if (typeof document !== 'undefined' && element.contains(document.activeElement)) {
        const onFocusOut = (event: Event) => {
          const related = (event as FocusEvent).relatedTarget;
          if (related instanceof Node && element.contains(related)) return;
          element.removeEventListener('focusout', onFocusOut);
          focusCleanup = undefined;
          setReady(true);
        };
        element.addEventListener('focusout', onFocusOut);
        focusCleanup = () => element.removeEventListener('focusout', onFocusOut);
        return;
      }
      setReady(true);
    };

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        activate();
      },
      { rootMargin: '350px' }
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      focusCleanup?.();
    };
  }, [ready]);

  const content = ready ? (
    <WidgetErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </WidgetErrorBoundary>
  ) : (
    fallback
  );

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
