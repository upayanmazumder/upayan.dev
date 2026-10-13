import type { ComponentProps, ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe } from 'lucide-react';
import { siGithub, siPypi } from 'simple-icons';

import type { LinkItem } from '@/data/types';
import { cn } from '@/lib/utils';

/** next/link for internal paths, a new-tab anchor for external URLs. */
export function SmartLink({
  href,
  children,
  ...rest
}: Omit<ComponentProps<'a'>, 'href'> & { href: string }) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/** Brand glyph for known hosts; a globe for everything else. Named icon imports keep client bundles small. */
export function LinkGlyph({ href, className }: { href: string; className?: string }) {
  const brand = href.includes('github.com') ? siGithub : href.includes('pypi.org') ? siPypi : null;
  if (!brand) return <Globe aria-hidden className={cn('size-4 shrink-0', className)} />;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={cn('size-4 shrink-0', className)}
    >
      <path d={brand.path} />
    </svg>
  );
}

interface ProjectLinksProps {
  links: LinkItem[];
  className?: string;
  /** Prefix for accessible names, e.g. the project name. */
  context?: string;
  children?: ReactNode;
}

/** Labelled link pills. Renders only real links from data. */
export function ProjectLinks({ links, className, context, children }: ProjectLinksProps) {
  if (links.length === 0 && !children) return null;
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {links.map(link => (
        <li key={link.href}>
          <SmartLink
            href={link.href}
            aria-label={context ? `${context}: ${link.label}` : undefined}
            className="group/link inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-ui text-xs font-medium text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
          >
            <LinkGlyph href={link.href} className="size-3.5" />
            {link.label}
            <ArrowUpRight
              aria-hidden
              className="size-3 transition-transform duration-300 ease-out-expo group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-focus-visible/link:translate-x-0.5 group-focus-visible/link:-translate-y-0.5"
            />
          </SmartLink>
        </li>
      ))}
      {children}
    </ul>
  );
}
