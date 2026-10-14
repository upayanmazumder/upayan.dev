import { Suspense } from 'react';
import type { Metadata } from 'next';

import { CertificatesGallery } from '@/components/certificates/certificates-gallery';
import { SplitHeading } from '@/components/certificates/split-heading';
import { certificates } from '@/data/certificates';

export const metadata: Metadata = {
  title: 'Certificates',
  description: `${certificates.length} certificates from courses, hackathons, and events.`,
  alternates: { canonical: '/certificates' },
};

export default function CertificatesPage() {
  return (
    <div className="column pt-32 pb-24 md:pt-40">
      <p className="label mb-3 font-mono text-teal">{certificates.length} total</p>
      <SplitHeading text="Certificates" className="mb-4 text-4xl font-semibold md:text-6xl" />
      <p className="mb-10 max-w-prose text-muted-foreground">
        Courses, hackathons, and events. Pick an issuer to filter.
      </p>
      <Suspense>
        <CertificatesGallery />
      </Suspense>
    </div>
  );
}
