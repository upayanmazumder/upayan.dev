'use client';

import DecryptedText from '@/components/rb/DecryptedText';

import { useReducedMotion } from '../use-reduced-motion';

// Every scramble finishes in STEPS ticks of TICK_MS (under half a second), however long the text.
const STEPS = 12;
const TICK_MS = 40;

interface DecryptProps {
  text: string;
  className?: string;
}

/**
 * Scrambles into `text` once, the first time it scrolls into view. Later text changes swap in
 * plainly. Plain text under reduced motion and SSR.
 */
export function Decrypt({ text, className }: DecryptProps) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  return (
    <DecryptedText
      text={text}
      animateOn="view"
      sequential
      speed={TICK_MS}
      revealPerTick={Math.max(1, Math.ceil(text.length / STEPS))}
      characters="abcdefghijklmnopqrstuvwxyz0123456789/#*+"
      parentClassName={className}
      encryptedClassName="text-teal/70"
    />
  );
}
