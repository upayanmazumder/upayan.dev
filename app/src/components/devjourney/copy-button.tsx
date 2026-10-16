'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { actionClass } from './styles';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
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
      {copied ? (
        <Check aria-hidden className="size-3.5 text-teal" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
