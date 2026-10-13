'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';

import { profile } from '@/data/profile';

/** Copies the contact email and confirms with a toast. Falls back to mailto when clipboard is blocked. */
export function useCopyEmail() {
  return useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast.success('Email copied', { description: profile.email });
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }, []);
}
