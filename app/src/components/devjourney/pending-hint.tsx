'use client';

import type { ReactNode } from 'react';
import { useLinkStatus } from 'next/link';
import { LoaderCircle } from 'lucide-react';

interface PendingHintProps {
  /** Shown while the parent link is idle. */
  children: ReactNode;
}

/** Swaps a row's trailing icon for a spinner while its Link navigation is in flight. */
export function PendingHint({ children }: PendingHintProps) {
  const { pending } = useLinkStatus();
  return pending ? (
    <LoaderCircle aria-hidden className="size-4 shrink-0 animate-spin text-teal" />
  ) : (
    children
  );
}
