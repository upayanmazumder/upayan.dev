'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'motion/react';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { certificates } from '@/data/certificates';
import type { Certificate } from '@/data/types';
import { cn } from '@/lib/utils';

import { CertificateLightbox } from './certificate-lightbox';
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
    <>
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
                'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                selected
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-line text-muted-foreground hover:border-line-strong hover:text-foreground'
              )}
            >
              {g ?? 'All'}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-12">
        {sections.map(([heading, list]) => (
          <section key={heading} aria-label={heading}>
            {group ? null : (
              <h2 className="mb-4 flex items-baseline gap-3 text-lg">
                {heading}
                <span className="font-mono text-xs font-normal text-muted-foreground tabular-nums">
                  {list.length}
                </span>
              </h2>
            )}
            <ul className="columns-1 gap-4 sm:columns-2 md:columns-3">
              {list.map(cert => (
                <li key={cert.slug} className="mb-4 break-inside-avoid">
                  <button
                    type="button"
                    onClick={e => open(cert, e.currentTarget)}
                    aria-label={`Open ${cert.title}`}
                    className="block w-full overflow-hidden rounded-lg border border-line bg-surface text-left transition-colors hover:border-line-strong"
                  >
                    <Image
                      src={encodeURI(cert.image)}
                      alt=""
                      width={1200}
                      height={900}
                      sizes="(min-width: 768px) 16rem, (min-width: 640px) 50vw, 100vw"
                      className="h-auto w-full border-b border-line bg-surface-2"
                    />
                    <span className="flex flex-col gap-1 p-3">
                      <span className="text-sm font-medium">{cert.title}</span>
                      <span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span>{cert.issuer}</span>
                        <time dateTime={cert.date} className="font-mono tabular-nums">
                          {formatCertDate(cert.date)}
                        </time>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && visible[active] ? (
          <CertificateLightbox list={visible} index={active} onIndex={setActive} onClose={close} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
