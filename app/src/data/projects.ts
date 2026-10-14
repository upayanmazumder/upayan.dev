import type { FeaturedProject, OpenSource, Project } from './types';

/** Large "blocks" on the home page; each gets a case study at /projects/[slug]. */
export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'papers',
    name: 'Papers',
    org: 'CodeChef-VIT',
    summary: 'Past exam papers for every VIT student, in one place, in seconds.',
    role: 'Maintainer',
    period: { start: '2025-04', end: '2026-09' },
    metrics: [
      { value: 134, suffix: 'K+', label: 'students served' },
      { value: 3.3, suffix: 'M+', label: 'page views' },
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Cloud hosting'],
    image: '/projects/papers-codechef.webp',
    links: [
      { label: 'Visit', href: 'https://papers.codechefvit.com' },
      { label: 'Source', href: 'https://github.com/CodechefVIT/papers-codechef' },
    ],
    caseStudy: {
      problem:
        'Before exams, students hunted for old papers across group chats and drives. Files were scattered, duplicated, and hard to search.',
      built: [
        'Kept the site fast and online through exam-season traffic spikes.',
        'Shipped new features and fixed reliability issues as they came up.',
        'Improved how files are delivered so papers open quickly on slow campus networks.',
      ],
      outcome:
        'Papers became the default place VIT students go before exams: 134K+ users and 3.3M+ page views.',
    },
  },
  {
    slug: 'vcap',
    name: 'VCAP',
    org: 'VIT',
    summary:
      'The platform VIT uses to run capstone and course projects, from team formation to grading.',
    role: 'Frontend lead & infrastructure owner',
    period: { start: '2026-03', end: null },
    metrics: [],
    stack: ['Next.js', 'Go', 'FastAPI', 'PostgreSQL', 'Redis', 'Kubernetes', 'ArgoCD', 'KEDA'],
    image: '/projects/vcap.webp',
    links: [],
    caseStudy: {
      problem:
        'Course projects ran on spreadsheets and email. Faculty could not track teams, reviews, and grades across several rounds in one place.',
      built: [
        'Lead the frontend: the screens students and faculty use every day.',
        'Work on the services that decide who can see and grade what, across multiple review rounds.',
        'Own the servers: every change deploys automatically, and capacity grows when load does.',
        'Help build the workers that generate project documents automatically.',
      ],
      outcome:
        'One system now runs project work across B.Tech and M.Tech courses, and it stays up through submission deadlines.',
    },
  },
  {
    slug: 'kargo',
    name: 'Kargo',
    org: 'GDG on Campus VIT',
    summary: 'Deploy an app by describing it. Kargo handles the servers.',
    role: 'Builder & maintainer',
    period: { start: '2025-05', end: '2025-10' },
    metrics: [],
    stack: ['Go', 'Kubernetes', 'Docker', 'CI/CD'],
    image: '/projects/kargo.webp',
    links: [
      { label: 'Visit', href: 'https://kargo.upayan.dev' },
      { label: 'Backend', href: 'https://github.com/GDGVIT/kargo-backend' },
      { label: 'Frontend', href: 'https://github.com/GDGVIT/kargo-frontend' },
    ],
    caseStudy: {
      problem:
        'Students could build apps but got stuck putting them online. Servers, containers, and configs were a wall.',
      built: [
        'A guided setup, assisted by AI, that turns an app into a running deployment.',
        'Accounts, teams, and projects so many people can share one platform safely.',
        'Pipelines that build, publish, and roll out every new version automatically.',
      ],
      outcome:
        'Students ship apps without touching a server. The chapter also used Kargo as its recruitment portal.',
    },
  },
];

/** Compact "components" grid. */
export const projects: Project[] = [
  {
    slug: 'ffcs-inator',
    name: 'FFCS-inator',
    org: 'CodeChef-VIT',
    summary:
      'Builds a clash-free VIT timetable from your priorities in seconds. Used by 30K+ students.',
    icon: '/projects/ffcs-inator.webp',
    tags: ['Web app'],
    links: [
      { label: 'Visit', href: 'https://ffcs.codechefvit.com' },
      { label: 'Source', href: 'https://github.com/CodechefVIT/ffcs' },
    ],
  },
  {
    slug: 'kodesphere',
    name: 'Kodesphere',
    summary: 'Deploy smarter, not harder.',
    icon: '/projects/kodesphere.webp',
    tags: ['Deployment', 'Docker'],
    links: [
      { label: 'Visit', href: 'https://ks.upayan.dev' },
      { label: 'Source', href: 'https://github.com/upayanmazumder/kodesphere' },
    ],
  },
  {
    slug: 'devsoc-26',
    name: 'DevSoc ’26',
    org: 'CodeChef-VIT',
    summary: 'Landing page, participant portal, and backend for CodeChef-VIT’s flagship hackathon.',
    icon: '/projects/devsoc-26.webp',
    tags: ['Event', 'Full-stack'],
    links: [
      { label: 'Visit', href: 'https://devsoc26.codechefvit.com' },
      { label: 'Portal', href: 'https://portal.devsoc26.codechefvit.com' },
      { label: 'Source', href: 'https://github.com/CodechefVIT/devsoc-backend-26' },
    ],
  },
  {
    slug: 'paradox-26',
    name: 'Paradox ’26',
    org: 'IIT Madras',
    summary: 'Frontend and backend features for the IIT Madras BS fest’s web apps.',
    icon: '/projects/paradox-26.webp',
    tags: ['Event', 'Full-stack'],
    links: [{ label: 'GitHub', href: 'https://github.com/iitm-paradox' }],
  },
  {
    slug: 'cookoff-11',
    name: 'CookOff 11',
    org: 'CodeChef-VIT',
    summary: 'Led the frontend and backend for the chapter’s coding contest.',
    icon: '/projects/cookoff-11.webp',
    tags: ['Event', 'Full-stack'],
    links: [],
  },
  {
    slug: 'github-org-manager',
    name: 'GitHub Org Manager',
    org: 'CodeChef-VIT',
    summary:
      'Internal tool that manages members and repositories for the chapter’s GitHub organization.',
    tags: ['Internal tool'],
    links: [],
  },
  {
    slug: 'cookoff-10',
    name: 'CookOff 10',
    org: 'CodeChef-VIT',
    summary: 'Contest portal with live scores and progress tracking.',
    icon: '/projects/cookoff-10.webp',
    tags: ['Event', 'Frontend'],
    links: [
      { label: 'Visit', href: 'https://cookoff25.codechefvit.com' },
      { label: 'Source', href: 'https://github.com/CodeChefVIT/cookoff-portal-10.0' },
    ],
  },
  {
    slug: 'internal-portal',
    name: 'Internal Portal',
    org: 'CodeChef-VIT',
    summary: 'The chapter’s internal portal for recruitment and events.',
    tags: ['Internal tool'],
    links: [],
  },
  {
    slug: 'memory-book',
    name: 'The Memory Book',
    org: 'GDG on Campus VIT',
    summary: 'A map where people pin and revisit their travel memories.',
    tags: ['Web app'],
    links: [],
  },
  {
    slug: 'traffic-control-system',
    name: 'Traffic Control System',
    summary: 'Smarter traffic signals for city road networks.',
    icon: '/projects/traffic-control-system.webp',
    tags: ['Simulation', 'Docker'],
    links: [
      { label: 'Visit', href: 'https://ibreakstuff.upayan.dev' },
      {
        label: 'Source',
        href: 'https://github.com/upayanmazumder/Advanced-Traffic-Control-System-for-Urban-Road-Network',
      },
    ],
  },
  {
    slug: 'boardly',
    name: 'Boardly',
    org: 'KalkiNi',
    summary: 'One place to prepare for board exams.',
    icon: '/projects/boardly.webp',
    tags: ['Web app'],
    links: [{ label: 'Visit', href: 'https://boardly.in' }],
  },
  {
    slug: 'collaborative-article-sharing',
    name: 'Collaborative Article Sharing',
    summary: 'Write, share, and discuss articles together. Ships as a Python package too.',
    icon: '/projects/collaborative-article-sharing.webp',
    tags: ['Web app', 'API'],
    links: [
      { label: 'Visit', href: 'https://cas.upayan.dev' },
      { label: 'Source', href: 'https://github.com/upayanmazumder/Collaborative-Article-Sharing' },
      { label: 'PyPI', href: 'https://pypi.org/project/collaborative-article-sharing/' },
    ],
  },
  {
    slug: 'status-page',
    name: 'Status Page',
    summary: 'A simple status page for your websites.',
    icon: '/projects/status-page.webp',
    tags: ['Monitoring'],
    links: [
      { label: 'Visit', href: 'https://status-page.upayan.dev/' },
      { label: 'Source', href: 'https://github.com/upayanmazumder/status-page' },
    ],
  },
  {
    slug: 'devjourney',
    name: 'DevJourney',
    summary: 'Every piece of code I wrote while learning, browsable on this site.',
    icon: '/projects/devjourney.webp',
    tags: ['Archive'],
    links: [
      { label: 'Browse', href: '/devjourney' },
      { label: 'Source', href: 'https://github.com/upayanmazumder/DevJourney' },
    ],
  },
  {
    slug: 'scamzap',
    name: 'ScamZap',
    summary: 'Find and report scams in a few taps.',
    icon: '/projects/scamzap.webp',
    tags: ['Web app'],
    links: [
      { label: 'Visit', href: 'https://scamzap.upayan.dev' },
      { label: 'Source', href: 'https://github.com/upayanmazumder/scamzap' },
    ],
  },
  {
    slug: 'clueminati-26',
    name: 'Clueminati ’26',
    org: 'CodeChef-VIT',
    summary: 'Led the frontend and backend for CodeChef-VIT’s puzzle hunt.',
    icon: '/projects/clueminati-26.webp',
    tags: ['Event', 'Full-stack'],
    links: [],
  },
];

export const openSource: OpenSource[] = [
  {
    name: 'Microsoft PowerToys',
    summary: 'Contributor to Microsoft’s set of power-user tools for Windows.',
    href: 'https://github.com/microsoft/PowerToys',
    icon: '/projects/powertoys.webp',
  },
  {
    name: 'SeaweedFS',
    summary: 'Contributor to a fast, open-source storage system built for billions of files.',
    href: 'https://github.com/seaweedfs/seaweedfs',
    icon: '/projects/seaweedfs.webp',
  },
  {
    name: 'Hacktoberfest 2025',
    summary: 'Super Contributor.',
    href: 'https://hacktoberfest.com',
  },
];
