'use client';

import type { ComponentProps } from 'react';
import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = ComponentProps<typeof SonnerToaster>;

export function Toaster(props: ToasterProps) {
  const { theme = 'system' } = useTheme();
  return (
    <SonnerToaster theme={theme as ToasterProps['theme']} className="toaster group" {...props} />
  );
}
