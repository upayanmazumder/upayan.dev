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
      className="cursor-pointer transition-colors hover:text-teal focus-visible:text-teal"
    >
      {profile.email}
    </button>
  );
}
