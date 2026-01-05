interface NavLink {
  href: string;
  icon: string;
  label: string;
}

const navLinks: NavLink[] = [
  {
    href: '/',
    icon: 'BsHouse',
    label: 'Home',
  },
  {
    href: '/#sponsors',
    icon: 'BsHeart',
    label: 'Sponsors',
  },
  {
    href: '/#clubs',
    icon: 'BsPeople',
    label: 'Clubs',
  },
  {
    href: '/#projects',
    icon: 'BsKanban',
    label: 'Projects',
  },
  {
    href: '/certificates',
    icon: 'BsPatchCheck',
    label: 'Certificates',
  },
  {
    href: '/devjourney',
    icon: 'BsCodeSlash',
    label: 'DevJourney',
  },
  {
    href: '/contact',
    icon: 'BsEnvelope',
    label: 'Contact',
  },
];

export default navLinks;
export type { NavLink };
