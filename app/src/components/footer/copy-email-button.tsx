'use client';

import { profile } from '@/data/profile';
import { useCopyEmail } from '@/hooks/use-copy-email';

export function CopyEmailButton() {
  const copy = useCopyEmail();
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={`Copy email ${profile.email}`}
      className="font-mono text-xs text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal focus-visible:outline-none"
    >
      {profile.email}
    </button>
  );
}
