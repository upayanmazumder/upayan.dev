import type { Sponsor } from './types';

export interface NavItem {
  label: string;
  href: string;
  /** Short description shown in the nav panel and command palette. */
  hint: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', hint: 'Start here' },
  {
    label: 'Work',
    href: '/#work',
    hint: 'Jobs and communities',
  },
  {
    label: 'Projects',
    href: '/#projects',
    hint: 'What I built',
  },
  {
    label: 'Certificates',
    href: '/certificates',
    hint: 'Courses and hackathons',
  },
  {
    label: 'DevJourney',
    href: '/devjourney',
    hint: 'Code I wrote while learning',
  },
  { label: 'Resume', href: '/Upayan_Mazumder_Resume.pdf', hint: 'One-page PDF' },
];

export const sponsors: Sponsor[] = [{ name: 'Max', handle: '@Hax', logo: '/sponsors/hax.png' }];
