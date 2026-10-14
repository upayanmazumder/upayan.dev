import {
  ArrowUpRight,
  FileText,
  FolderGit2,
  Hash,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

import { otherSocials, primarySocials } from '@/data/profile';
import { featuredProjects, projects } from '@/data/projects';
import { navItems } from '@/data/site';

import { homeSections } from './sections';

export interface PaletteEntry {
  /** Unique cmdk value; also what search matches against, together with `keywords`. */
  value: string;
  label: string;
  /** Right-aligned mono hint: a path or a domain. */
  hint: string;
  href: string;
  Icon?: LucideIcon;
  /** simple-icons key, rendered with BrandIcon instead of `Icon`. */
  brand?: string;
  keywords?: string[];
}

export interface PaletteGroup {
  heading: string;
  entries: PaletteEntry[];
}

const domain = (href: string) => new URL(href).hostname.replace(/^www\./, '');

/** Navigation groups for the command palette. Actions (copy email, call) live in the palette itself. */
export const paletteGroups: PaletteGroup[] = [
  {
    heading: 'Pages',
    entries: navItems.map(item => ({
      value: `page ${item.label}`,
      label: item.label,
      hint: item.href.endsWith('.pdf') ? 'PDF' : item.href,
      href: item.href,
      Icon: item.href.endsWith('.pdf') ? FileText : LayoutGrid,
      keywords: [item.label, item.hint],
    })),
  },
  {
    heading: 'Sections',
    entries: homeSections.map((section, index) => ({
      value: `section ${section.id}`,
      label: section.label,
      hint: String(index + 1).padStart(2, '0'),
      href: `/#${section.id}`,
      Icon: Hash,
      keywords: [section.label],
    })),
  },
  {
    heading: 'Projects',
    entries: [
      ...featuredProjects.map(project => ({
        value: `project ${project.slug}`,
        label: project.name,
        hint: 'Case study',
        href: `/projects/${project.slug}`,
        Icon: FolderGit2,
        keywords: [project.name, project.summary, ...project.stack],
      })),
      ...projects.flatMap(project => {
        const link = project.links[0];
        if (!link) return [];
        return [
          {
            value: `project ${project.slug}`,
            label: project.name,
            hint: link.href.startsWith('/') ? link.href : domain(link.href),
            href: link.href,
            Icon: link.href.startsWith('/') ? LayoutGrid : ArrowUpRight,
            keywords: [project.name, project.summary, ...project.tags],
          },
        ];
      }),
    ],
  },
  {
    heading: 'Links',
    entries: [...primarySocials, ...otherSocials].map(social => ({
      value: `link ${social.id}`,
      label: social.label,
      hint: social.handle ?? domain(social.href),
      href: social.href,
      brand: social.icon,
      keywords: [social.label, social.handle ?? ''],
    })),
  },
];
