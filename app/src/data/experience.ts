import type { Organization } from './types';

export const work: Organization[] = [
  {
    id: '797th',
    name: '797th LLC',
    location: 'Remote',
    roles: [{ title: 'Junior Software Engineer', start: '2026-10', end: null }],
  },
  {
    id: 'kalkini',
    name: 'KalkiNi',
    about: 'AI surveillance startup',
    location: 'Vellore, India',
    href: 'https://www.linkedin.com/company/kalkini-ai-surveillance-system',
    roles: [
      {
        title: 'Frontend Web Development Intern',
        start: '2024-12',
        end: '2025-03',
        points: [
          'Built 15+ reusable React and TypeScript components used across their production apps.',
          'Built the checkout flow and connected secure payments.',
        ],
      },
    ],
  },
  {
    id: 'bbn',
    name: 'BBN Music',
    about: 'Artist community platform',
    location: 'Remote · United States',
    logo: '/media/brands/bbn.webp',
    roles: [
      {
        title: 'Digital Engagement & Junior Developer',
        start: '2023-06',
        end: '2025-03',
        points: [
          'Shipped 10+ features for the artist community and helped lift engagement by 15%.',
          'Made pages load faster and added ad slots so the platform could earn from traffic.',
        ],
      },
    ],
  },
];

export const communities: Organization[] = [
  {
    id: 'gdg',
    name: 'GDG on Campus VIT',
    about: 'Google Developer Group chapter',
    location: 'Vellore, India',
    logo: '/clubs/gdsc-vit.png',
    href: 'https://dscvit.com',
    roles: [
      { title: 'Senior Core Member', start: '2026-03', end: null },
      {
        title: 'Junior Core Member · Full-stack',
        start: '2025-04',
        end: '2026-03',
        points: [
          'Built Kargo, the chapter’s recruitment portal, on a Kubernetes deployment platform.',
          'Built The Memory Book, a map where people pin travel memories.',
        ],
      },
    ],
  },
  {
    id: 'codechef',
    name: 'CodeChef-VIT',
    about: 'Programming and software chapter',
    location: 'Vellore, India',
    logo: '/clubs/codechef-vit.png',
    href: 'https://www.codechefvit.com',
    roles: [
      {
        title: 'Projects Lead',
        start: '2026-07',
        end: '2026-09',
        points: ['Set the technical direction for every software project in the chapter.'],
      },
      {
        title: 'Senior Core Member',
        start: '2026-01',
        end: '2026-07',
        points: [
          'Built DevSoc ’26 end to end: landing page, participant portal, and backend.',
          'Led frontend and backend for Clueminati ’26 and CookOff 11.',
          'Built internal tools for recruitment and events, including a GitHub org manager.',
        ],
      },
      {
        title: 'Junior Core Member',
        start: '2025-02',
        end: '2026-01',
        points: [
          'Kept Papers running for 134K+ students and 3.3M+ page views.',
          'Worked on the CookOff 10 frontend.',
        ],
      },
    ],
  },
  {
    id: 'tam',
    name: 'TAM-VIT',
    about: 'AI and machine learning club',
    location: 'Vellore, India',
    logo: '/clubs/tam-vit.png',
    href: 'https://www.linkedin.com/company/tam-vit',
    roles: [
      { title: 'Senior Core Member', start: '2026-01', end: '2026-08' },
      { title: 'Junior Core Member · Frontend', start: '2025-03', end: '2026-01' },
    ],
  },
  {
    id: 'paradox',
    name: 'Paradox, IIT Madras',
    about: 'IIT Madras BS degree fest',
    location: 'Chennai, India',
    roles: [
      {
        title: 'Web Developer',
        start: '2025-12',
        end: '2026-08',
        points: [
          'Built frontend and backend features for the fest’s web apps and tested them before each launch.',
          'Coordinated operations for Paradox ’26 and volunteered at Margazhi ’26.',
        ],
      },
    ],
  },
];
