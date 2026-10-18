import { LiveSlot } from '@/components/home/_top/live/live-slot';
import { About } from '@/components/home/about';
import { Communities } from '@/components/home/communities';
import { Elsewhere } from '@/components/home/elsewhere';
import { FeaturedProjects } from '@/components/home/featured-projects';
import { GitHubTile } from '@/components/home/github-tile';
import { Hero } from '@/components/home/hero';
import { MoreProjects } from '@/components/home/more-projects';
import { OpenSource } from '@/components/home/open-source';
import { SponsorsTile } from '@/components/home/sponsors-tile';
import { Stack } from '@/components/home/stack';
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
      {/* Each aside fills the margin opposite the roadmap trail beside its section. */}
      <About aside={{ caption: 'Now playing', content: <LiveSlot tile="spotify" /> }} />
      <Stack aside={{ caption: 'GitHub activity', content: <GitHubTile /> }} />
      <FeaturedProjects aside={{ caption: 'In the editor', content: <LiveSlot tile="zed" /> }} />
      <OpenSource aside={{ caption: 'Presence', content: <LiveSlot tile="discord" /> }} />
      <MoreProjects aside={{ caption: 'My machine', content: <LiveSlot tile="machine" /> }} />
      <Work aside={{ caption: 'Supported by', content: <SponsorsTile /> }} />
      <Communities />
      <Elsewhere />
    </>
  );
}
