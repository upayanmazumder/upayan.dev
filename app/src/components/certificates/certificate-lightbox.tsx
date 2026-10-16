'use client';

import { useCallback, useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { m } from 'motion/react';

import type { Certificate } from '@/data/types';

import { formatCertDate } from './format';

interface CertificateLightboxProps {
  list: Certificate[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

export function CertificateLightbox({ list, index, onIndex, onClose }: CertificateLightboxProps) {
  const cert = list[index]!;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, []);

  const step = useCallback(
    (d: number) => onIndex((index + d + list.length) % list.length),
    [index, list.length, onIndex]
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      const items = dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!items?.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <m.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-lightbox-title"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10"
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-background/95" />
      <div className="relative flex max-h-full w-full max-w-4xl flex-col gap-4">
        <div className="relative min-h-0 overflow-hidden rounded-lg border border-line bg-surface-2">
          <Image
            src={encodeURI(cert.image)}
            alt={cert.title}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 56rem, 100vw"
            priority
            className="mx-auto h-auto max-h-[70dvh] w-auto object-contain"
          />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="cert-lightbox-title" className="text-lg">
              {cert.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {cert.issuer} ·{' '}
              <time dateTime={cert.date} className="font-mono text-xs tabular-nums">
                {formatCertDate(cert.date)}
              </time>
            </p>
            {cert.tags.length ? (
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {cert.tags.map(t => (
                  <li
                    key={t}
                    className="rounded-full border border-line px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {index + 1} / {list.length}
            </span>
            <LightboxButton label="Previous certificate" onClick={() => step(-1)}>
              ←
            </LightboxButton>
            <LightboxButton label="Next certificate" onClick={() => step(1)}>
              →
            </LightboxButton>
            <LightboxButton label="Close" onClick={onClose} autoFocus>
              ×
            </LightboxButton>
          </div>
        </div>
      </div>
    </m.div>
  );
}

interface LightboxButtonProps {
  label: string;
  onClick: () => void;
  autoFocus?: boolean;
  children: ReactNode;
}

function LightboxButton({ label, onClick, autoFocus, children }: LightboxButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-autofocus={autoFocus || undefined}
      className="flex size-10 items-center justify-center rounded-full border border-line font-mono text-sm text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
    >
      {children}
    </button>
  );
}
