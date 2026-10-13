import type { Sponsor } from './types';

export interface NavItem {
  label: string;
  href: string;
  /** Short description shown in the nav panel and command palette. */
  hint: string;
  /** Preview image shown on hover in the nav panel. */
  preview?: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', hint: 'Start here', preview: '/upayan.webp' },
  {
    label: 'Work',
    href: '/#work',
    hint: 'Jobs and communities',
    preview: '/clubs/codechef-vit.png',
  },
  {
    label: 'Projects',
    href: '/#projects',
    hint: 'What I built',
    preview: '/projects/papers-codechef.webp',
  },
  {
    label: 'Certificates',
    href: '/certificates',
    hint: 'Courses and hackathons',
    preview: '/certificates/Github/2025-04-11_Github-Foundations.avif',
  },
  {
    label: 'DevJourney',
    href: '/devjourney',
    hint: 'Code I wrote while learning',
    preview: '/projects/devjourney.webp',
  },
  { label: 'Resume', href: '/Upayan_Mazumder_Resume.pdf', hint: 'One-page PDF' },
];

export const sponsors: Sponsor[] = [{ name: 'Max', handle: '@Hax', logo: '/sponsors/hax.png' }];
