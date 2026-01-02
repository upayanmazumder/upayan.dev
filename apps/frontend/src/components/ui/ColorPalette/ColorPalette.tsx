'use client';

import { useEffect, useState } from 'react';

type Token = { key: string; label: string };

const sections: { title: string; tokens: Token[] }[] = [
  {
    title: 'Core',
    tokens: [
      { key: '--background', label: 'background' },
      { key: '--foreground', label: 'foreground' },
      { key: '--card', label: 'card' },
      { key: '--card-foreground', label: 'card-foreground' },
      { key: '--popover', label: 'popover' },
      { key: '--popover-foreground', label: 'popover-foreground' },
      { key: '--primary', label: 'primary' },
      { key: '--primary-foreground', label: 'primary-foreground' },
      { key: '--secondary', label: 'secondary' },
      { key: '--secondary-foreground', label: 'secondary-foreground' },
      { key: '--muted', label: 'muted' },
      { key: '--muted-foreground', label: 'muted-foreground' },
      { key: '--accent', label: 'accent' },
      { key: '--accent-foreground', label: 'accent-foreground' },
      { key: '--destructive', label: 'destructive' },
      { key: '--border', label: 'border' },
      { key: '--input', label: 'input' },
      { key: '--ring', label: 'ring' },
    ],
  },
  {
    title: 'Charts',
    tokens: [
      { key: '--chart-1', label: 'chart-1' },
      { key: '--chart-2', label: 'chart-2' },
      { key: '--chart-3', label: 'chart-3' },
      { key: '--chart-4', label: 'chart-4' },
      { key: '--chart-5', label: 'chart-5' },
    ],
  },
  {
    title: 'Sidebar',
    tokens: [
      { key: '--sidebar', label: 'sidebar' },
      { key: '--sidebar-foreground', label: 'sidebar-foreground' },
      { key: '--sidebar-primary', label: 'sidebar-primary' },
      {
        key: '--sidebar-primary-foreground',
        label: 'sidebar-primary-foreground',
      },
      { key: '--sidebar-accent', label: 'sidebar-accent' },
      {
        key: '--sidebar-accent-foreground',
        label: 'sidebar-accent-foreground',
      },
      { key: '--sidebar-border', label: 'sidebar-border' },
      { key: '--sidebar-ring', label: 'sidebar-ring' },
    ],
  },
  {
    title: 'Theme (inline)',
    tokens: [
      { key: '--color-primary', label: 'color-primary' },
      { key: '--color-secondary-100', label: 'secondary-100' },
      { key: '--color-secondary-200', label: 'secondary-200' },
      { key: '--color-secondary-300', label: 'secondary-300' },
      { key: '--color-secondary-400', label: 'secondary-400' },
      { key: '--color-secondary-500', label: 'secondary-500' },
      { key: '--color-secondary-600', label: 'secondary-600' },
      { key: '--color-secondary-700', label: 'secondary-700' },
      { key: '--color-tertiary', label: 'tertiary' },
      { key: '--color-grey-100', label: 'grey-100' },
      { key: '--color-grey-200', label: 'grey-200' },
      { key: '--color-grey-300', label: 'grey-300' },
      { key: '--color-grey-400', label: 'grey-400' },
      { key: '--color-grey-500', label: 'grey-500' },
      { key: '--color-grey-600', label: 'grey-600' },
      { key: '--color-grey-700', label: 'grey-700' },
      { key: '--color-grey', label: 'grey (base)' },
    ],
  },
];

export default function ColorPalette() {
  const [resolved, setResolved] = useState<Record<string, string>>({});

  useEffect(() => {
    const r: Record<string, string> = {};
    const style = getComputedStyle(document.documentElement);
    sections.forEach((s) =>
      s.tokens.forEach((t) => {
        const val = style.getPropertyValue(t.key).trim();
        r[t.key] = val || '(not set)';
      }),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved(r);
  }, []);

  return (
    <div className="space-y-8 p-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold mb-3">{section.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {section.tokens.map((t) => (
              <div
                key={t.key}
                className="rounded-xl overflow-hidden shadow-sm border"
                style={{ background: `var(${t.key})` }}
              >
                <div className="p-3 bg-black/10 dark:bg-white/5">
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.key}</div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/60">
                  <div className="text-xs warp-break-word">
                    {resolved[t.key] ?? '…'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
