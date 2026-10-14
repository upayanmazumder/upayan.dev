import type { Social } from './types';

export const profile = {
  name: 'Upayan Mazumder',
  firstName: 'Upayan',
  role: 'Full-stack & platform engineer',
  sentence: 'I build web tools people actually use.',
  currently: ['Junior Software Engineer at 797th LLC'],
  status: 'Open to internships',
  location: 'India',
  timeZone: 'Asia/Kolkata',
  email: 'mail@upayan.dev',
  phone: '+91 85097 01939',
  phoneHref: 'tel:+918509701939',
  resume: '/Upayan_Mazumder_Resume.pdf',
  photo: '/upayan.webp',
  site: 'https://upayan.dev',
  repo: 'https://github.com/upayanmazumder/upayan.dev',
  githubUser: 'upayanmazumder',
  githubSponsors: 'https://github.com/sponsors/upayanmazumder',
  about: [
    'I study Computer Science (Data Science) at VIT Vellore and Data Science at IIT Madras.',
    'I like owning things end to end: the interface people see, the service behind it, and the servers it runs on.',
    'My work runs where people depend on it. Papers serves exam papers to 134K+ students. FFCS-inator plans timetables for 30K+.',
    'Right now I work as a junior software engineer at 797th LLC and lead the infrastructure for VCAP at VIT.',
  ],
} as const;

/** Shown as prominent buttons in the hero. */
export const primarySocials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@upayanmazumder',
    href: 'https://github.com/upayanmazumder',
    icon: 'siGithub',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/upayanmazumder',
    href: 'https://www.linkedin.com/in/upayanmazumder/',
    icon: 'linkedin',
  },
];

/** Shown in the "Elsewhere" row, the nav panel, and the command palette. */
export const otherSocials: Social[] = [
  {
    id: 'leetcode',
    label: 'LeetCode',
    href: 'https://leetcode.com/u/upayanmazumder/',
    icon: 'siLeetcode',
  },
  {
    id: 'kaggle',
    label: 'Kaggle',
    href: 'https://www.kaggle.com/upayanmazumder',
    icon: 'siKaggle',
  },
  { id: 'devfolio', label: 'Devfolio', href: 'https://devfolio.co/@Upayan', icon: 'devfolio' },
  {
    id: 'mslearn',
    label: 'Microsoft Learn',
    href: 'https://learn.microsoft.com/en-gb/users/upayan',
    icon: 'microsoft',
  },
  {
    id: 'iitm',
    label: 'IIT Madras',
    href: 'https://ds.study.iitm.ac.in/student/24F2002974',
    icon: 'iitm',
  },
  {
    id: 'discord',
    label: 'Discord',
    href: 'https://discord.com/users/1240025366853193758',
    icon: 'siDiscord',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/upayan.mazumder/',
    icon: 'siInstagram',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/upayan.mazumder',
    icon: 'siFacebook',
  },
  {
    id: 'gravatar',
    label: 'Gravatar',
    href: 'https://gravatar.com/upayanmazumder',
    icon: 'siGravatar',
  },
];
