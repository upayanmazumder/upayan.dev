import type { ReactNode } from 'react';

import { PageTransition } from '@/components/motion';

export default function MotionTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
