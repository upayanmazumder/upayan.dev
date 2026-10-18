import { About } from '@/components/home/about';
import { Communities } from '@/components/home/communities';
import { Contributions } from '@/components/home/contributions';
import { Elsewhere } from '@/components/home/elsewhere';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { Hero } from '@/components/home/hero';
import { LiveNow } from '@/components/home/live-now';
import { MoreProjects } from '@/components/home/more-projects';
import { OpenSource } from '@/components/home/open-source';
import { Stack } from '@/components/home/stack';
import { SupportedBy } from '@/components/home/supported-by';
import { Work } from '@/components/home/work';
import { communities, work } from '@/data/experience';
import { otherSocials, primarySocials, profile } from '@/data/profile';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: profile.site,
  image: `${profile.site}${profile.photo}`,
  email: `mailto:${profile.email}`,
  jobTitle: work[0]?.roles[0]?.title,
  worksFor: work[0] ? { '@type': 'Organization', name: work[0].name } : undefined,
  description: profile.sentence,
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Vellore Institute of Technology' },
    { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Madras' },
  ],
  memberOf: communities.map(org => ({ '@type': 'Organization', name: org.name })),
  sameAs: [...primarySocials, ...otherSocials].map(social => social.href),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be raw JSON; `<` is escaped so data can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <About />
      <LiveNow />
      <SupportedBy />
      <Contributions />
      <Stack />
      <FeaturedProjects />
      <OpenSource />
      <MoreProjects />
      <Work />
      <Communities />
      <Elsewhere />
    </>
  );
}
