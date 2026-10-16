'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { toast } from 'sonner';

import { spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { actionClass } from './styles';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  // Avoid setting state after unmount when navigating away mid-feedback.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Could not copy. Select the code instead.');
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy file contents'}
      className={cn(actionClass, className)}
    >
      <span className="relative size-3.5">
        <AnimatePresence initial={false} mode="popLayout">
          <m.span
            key={copied ? 'done' : 'copy'}
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={spring.snappy}
            className="absolute inset-0"
          >
            {copied ? <Check className="size-3.5 text-teal" /> : <Copy className="size-3.5" />}
          </m.span>
        </AnimatePresence>
      </span>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
