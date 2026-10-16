import Image from 'next/image';
import Link from 'next/link';

import { formatCertDate } from '@/components/certificates/format';
import { Section } from '@/components/shell/section';
import { certificates } from '@/data/certificates';

const latest = [...certificates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

export function CertificatesPreview() {
  return (
    <Section id="certificates" title="Certificates">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {latest.map(cert => (
          <li key={cert.slug}>
            <Link
              href={`/certificates?group=${encodeURIComponent(cert.group)}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-line-strong"
            >
              <div className="relative aspect-[4/3] border-b border-line bg-surface-2">
                <Image
                  src={encodeURI(cert.image)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 16rem, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="line-clamp-2 text-sm font-medium">{cert.title}</span>
                <span className="text-xs text-muted-foreground">{cert.issuer}</span>
                <time
                  dateTime={cert.date}
                  className="mt-auto pt-1 font-mono text-xs text-muted-foreground tabular-nums"
                >
                  {formatCertDate(cert.date)}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/certificates"
        className="group mt-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal"
      >
        See all {certificates.length}
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </Link>
    </Section>
  );
}
