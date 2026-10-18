'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { useLenis } from '@/components/shell/smooth-scroll';
import { certificates } from '@/data/certificates';
import type { Certificate } from '@/data/types';
import { cn } from '@/lib/utils';

import { formatCertDate } from './format';

const groups = [...new Set(certificates.map(c => c.group))];
const groupParser = parseAsStringLiteral(groups).withOptions({ scroll: false });

/** Issuer → certificates, in data order (newest first). */
function byIssuer(list: Certificate[]) {
  const map = new Map<string, Certificate[]>();
  for (const cert of list) map.set(cert.issuer, [...(map.get(cert.issuer) ?? []), cert]);
  return [...map];
}

export function CertificatesGallery() {
  const [group, setGroup] = useQueryState('group', groupParser);
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => (group ? certificates.filter(c => c.group === group) : certificates),
    [group]
  );
  const sections = useMemo(
    () => (group ? [[group, visible] as const] : byIssuer(visible)),
    [group, visible]
  );

  const open = (cert: Certificate, el: HTMLElement) => {
    triggerRef.current = el;
    setActive(visible.indexOf(cert));
  };

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const chips = [null, ...groups] as const;

  return (
    <LayoutGroup>
      <div role="group" aria-label="Filter by issuer" className="mb-10 flex flex-wrap gap-2">
        {chips.map(g => {
          const selected = group === g;
          return (
            <button
              key={g ?? 'all'}
              type="button"
              aria-pressed={selected}
              onClick={() => void setGroup(g)}
              className={cn(
                'relative rounded-full border border-line px-3.5 py-1.5 font-ui text-xs transition-colors hover:border-line-strong focus-visible:border-teal focus-visible:outline-none',
                selected ? 'text-background' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {selected ? (
                <m.span
                  layoutId="cert-chip"
                  className="absolute inset-0 rounded-full bg-accent-foreground"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              ) : null}
              <span className="relative">{g ?? 'All'}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={group ?? 'all'}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-12"
        >
          {sections.map(([heading, list]) => (
            <section key={heading} aria-label={heading}>
              {group ? null : (
                <h2 className="mb-4 flex items-baseline gap-3 text-lg font-semibold">
                  {heading}
                  <span className="font-mono text-xs text-muted-foreground">{list.length}</span>
                </h2>
              )}
              <ul className="columns-1 gap-4 sm:columns-2 md:columns-3">
                {list.map((cert, i) => (
                  <m.li
                    key={cert.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                    className="mb-4 break-inside-avoid"
                  >
                    <button
                      type="button"
                      onClick={e => open(cert, e.currentTarget)}
                      aria-label={`Open ${cert.title}`}
                      className="group block w-full overflow-hidden rounded-xl border border-line bg-surface text-left transition-colors hover:border-line-strong focus-visible:border-teal focus-visible:outline-none"
                    >
                      <m.div
                        layoutId={`cert-${cert.slug}`}
                        className="overflow-hidden bg-surface-2"
                      >
                        <Image
                          src={encodeURI(cert.image)}
                          alt=""
                          width={1200}
                          height={900}
                          sizes="(min-width: 768px) 16rem, (min-width: 640px) 50vw, 100vw"
                          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                        />
                      </m.div>
                      <span className="flex flex-col gap-1 p-3">
                        <span className="font-ui text-sm font-semibold">{cert.title}</span>
                        <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>{cert.issuer}</span>
                          <time dateTime={cert.date} className="font-mono text-[0.7rem]">
                            {formatCertDate(cert.date)}
                          </time>
                        </span>
                      </span>
                    </button>
                  </m.li>
                ))}
              </ul>
            </section>
          ))}
        </m.div>
      </AnimatePresence>

      <AnimatePresence>
        {active !== null && visible[active] ? (
          <Lightbox list={visible} index={active} onIndex={setActive} onClose={close} />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}

interface LightboxProps {
  list: Certificate[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

function Lightbox({ list, index, onIndex, onClose }: LightboxProps) {
  const cert = list[index]!;
  const dialogRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [lenis]);

  useEffect(() => {
    dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, []);

  const step = useCallback(
    (d: number) => onIndex((index + d + list.length) % list.length),
    [index, list.length, onIndex]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
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
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-lightbox-title"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10"
    >
      <m.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
      />
      <div className="relative flex max-h-full w-full max-w-4xl flex-col gap-4">
        <m.div
          layoutId={`cert-${cert.slug}`}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-0 overflow-hidden rounded-xl border border-line-strong bg-surface-2"
        >
          <Image
            src={encodeURI(cert.image)}
            alt={cert.title}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 56rem, 100vw"
            priority
            className="mx-auto h-auto max-h-[70dvh] w-auto object-contain"
          />
        </m.div>
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div className="flex flex-col gap-1">
            <h2 id="cert-lightbox-title" className="text-lg font-semibold">
              {cert.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {cert.issuer} ·{' '}
              <time dateTime={cert.date} className="font-mono text-xs">
                {formatCertDate(cert.date)}
              </time>
            </p>
            {cert.tags.length ? (
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {cert.tags.map(t => (
                  <li
                    key={t}
                    className="rounded-full border border-line px-2 py-0.5 font-ui text-[0.7rem] text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
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
        </m.div>
      </div>
    </div>
  );
}

function LightboxButton({
  label,
  onClick,
  autoFocus,
  children,
}: {
  label: string;
  onClick: () => void;
  autoFocus?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      data-autofocus={autoFocus || undefined}
      className="flex size-9 items-center justify-center rounded-full border border-line font-mono text-sm text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-teal focus-visible:text-foreground focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
