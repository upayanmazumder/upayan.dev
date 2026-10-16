'use client';

import CountUp from '@/components/rb/CountUp';

import { useReducedMotion } from '../use-reduced-motion';

/** Contribution total that counts up once in view. Static under reduced motion. */
export function Total({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const className = 'font-mono text-2xl font-semibold text-foreground tabular-nums';
  if (reduced) return <span className={className}>{value.toLocaleString('en-US')}</span>;
  return <CountUp to={value} separator="," duration={1} className={className} />;
}
