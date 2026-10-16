/** Month precision date, ISO `YYYY-MM`. `null` end means present. */
export type MonthDate = `${number}-${number}`;

export interface LinkItem {
  label: string;
  href: string;
}

export interface Social {
  id: string;
  label: string;
  href: string;
  /** Short handle shown next to the label. */
  handle?: string;
  /** simple-icons key (e.g. "siGithub"), or a key in `customIcons`. */
  icon: string;
}

export interface Metric {
  /** Numeric part. */
  value: number;
  /** Appended after the number, e.g. "K+" or "M+". */
  suffix?: string;
  label: string;
}

export interface FeaturedProject {
  slug: string;
  name: string;
  /** One plain sentence: what it is and for whom. */
  summary: string;
  role: string;
  period: { start: MonthDate; end: MonthDate | null };
  org?: string;
  metrics: Metric[];
  stack: string[];
  /** Cover image under /public. */
  image: string;
  links: LinkItem[];
  caseStudy: {
    problem: string;
    built: string[];
    outcome: string;
  };
}

export interface Project {
  slug: string;
  name: string;
  summary: string;
  org?: string;
  /** Icon image under /public. Missing icons render a monogram. */
  icon?: string;
  tags: string[];
  links: LinkItem[];
}

export interface OpenSource {
  name: string;
  summary: string;
  href: string;
  icon?: string;
}

export interface Role {
  title: string;
  start: MonthDate;
  end: MonthDate | null;
  /** Plain bullets, outcome first. */
  points?: string[];
}

export interface Organization {
  id: string;
  name: string;
  /** Short line under the name, e.g. "AI surveillance startup". */
  about?: string;
  location: string;
  logo?: string;
  href?: string;
  roles: Role[];
}

export interface StackGroup {
  label: string;
  items: { name: string; icon?: string }[];
}

export interface Certificate {
  slug: string;
  title: string;
  issuer: string;
  /** Issuer group shown as a filter chip. */
  group: string;
  date: string;
  image: string;
  tags: string[];
}

export interface Sponsor {
  name: string;
  handle: string;
  logo: string;
  href?: string;
}
