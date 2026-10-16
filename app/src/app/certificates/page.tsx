import { Suspense } from 'react';
import type { Metadata } from 'next';

import { CertificatesGallery } from '@/components/certificates/certificates-gallery';
import { certificates } from '@/data/certificates';

export const metadata: Metadata = {
  title: 'Certificates',
  description: `${certificates.length} certificates from courses, hackathons, and events.`,
  alternates: { canonical: '/certificates' },
};

export default function CertificatesPage() {
  return (
    <div className="column pt-24 pb-24 md:pt-32">
      <p className="label mb-3 tabular-nums">{certificates.length} total</p>
      <h1 className="mb-4 text-4xl md:text-5xl">Certificates</h1>
      <p className="mb-10 max-w-prose text-muted-foreground">
        Courses, hackathons, and events. Pick an issuer to filter.
      </p>
      <Suspense>
        <CertificatesGallery />
      </Suspense>
    </div>
  );
}
