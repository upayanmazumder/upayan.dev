'use client';

import DecryptedText from '@/components/rb/DecryptedText';

import { useReducedMotion } from '../use-reduced-motion';

interface DecryptProps {
  text: string;
  className?: string;
}

/** Scrambles into `text` once when it scrolls into view. Plain text under reduced motion and SSR. */
export function Decrypt({ text, className }: DecryptProps) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  return (
    <DecryptedText
      text={text}
      animateOn="view"
      sequential
      speed={28}
      maxIterations={8}
      characters="abcdefghijklmnopqrstuvwxyz0123456789/#*+"
      parentClassName={className}
      encryptedClassName="text-teal/70"
    />
  );
}
