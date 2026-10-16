'use client';

import type { SplitText as SplitTextClass } from 'gsap/SplitText';

import { gsap } from '@/lib/gsap';

// A static plugin import would force SplitText into the initial layout bundle.
/** Dynamically loads and registers the GSAP SplitText plugin. */
export async function loadSplitText() {
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(SplitText);
  return SplitText;
}

export type SplitTextPlugin = typeof SplitTextClass;
