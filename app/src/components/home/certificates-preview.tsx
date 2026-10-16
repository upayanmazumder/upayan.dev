import Image from 'next/image';
import Link from 'next/link';

import { formatCertDate } from '@/components/certificates/format';
import { Reveal } from '@/components/shell/reveal';
import { Section } from '@/components/shell/section';
import { certificates } from '@/data/certificates';

import { CertificateCard } from './certificate-card';

const latest = [...certificates].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

export function CertificatesPreview() {
  return (
    <Section id="certificates" index="11" title="Certificates">
      <Reveal as="ul" stagger={0.06} className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {latest.map(cert => (
          <li key={cert.slug} data-reveal>
            <CertificateCard>
              <Link
                href={`/certificates?group=${encodeURIComponent(cert.group)}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong focus-visible:border-teal focus-visible:outline-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                  <Image
                    src={encodeURI(cert.image)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 16rem, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <span className="line-clamp-2 font-ui text-sm font-semibold">{cert.title}</span>
                  <span className="text-xs text-muted-foreground">{cert.issuer}</span>
                  <time
                    dateTime={cert.date}
                    className="mt-auto pt-1 font-mono text-[0.7rem] text-muted-foreground"
                  >
                    {formatCertDate(cert.date)}
                  </time>
                </div>
              </Link>
            </CertificateCard>
          </li>
        ))}
      </Reveal>
      <Link
        href="/certificates"
        className="group mt-8 inline-flex items-center gap-2 font-ui text-sm text-muted-foreground transition-colors hover:text-teal focus-visible:text-teal focus-visible:outline-none"
      >
        See all {certificates.length}
        <span
          aria-hidden
          className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
        >
          →
        </span>
      </Link>
    </Section>
  );
}
