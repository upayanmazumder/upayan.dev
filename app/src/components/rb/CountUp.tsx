'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useInView } from 'motion/react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 1,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        useGrouping: !!separator,
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
      }),
    [maxDecimals, separator]
  );

  const formatValue = useCallback(
    (latest: number) => {
      const formattedNumber = formatter.format(latest);
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [formatter, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  // A fixed-length ease-out tween: unlike a spring it ends exactly at `duration` with no long tail.
  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView || !startWhen) return;
    const start = direction === 'down' ? to : from;
    const end = direction === 'down' ? from : to;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let startedAt = 0;

    const step = (now: number) => {
      startedAt ||= now;
      const progress = reduce ? 1 : Math.min(1, (now - startedAt) / (duration * 1000));
      el.textContent = formatValue(start + (end - start) * (1 - (1 - progress) ** 3));
      if (progress < 1) raf = requestAnimationFrame(step);
      else onEnd?.();
    };

    onStart?.();
    const timeoutId = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(raf);
    };
  }, [isInView, startWhen, direction, from, to, delay, onStart, onEnd, duration, formatValue]);

  return <span className={className} ref={ref} />;
}
