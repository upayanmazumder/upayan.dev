import Link from 'next/link';

import { profile } from '@/data/profile';
import { navItems } from '@/data/site';

import pkg from '../../../package.json';
import { CopyEmailButton } from './copy-email-button';
import { FooterClock } from './footer-clock';
import { Wordmark } from './wordmark';

const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const linkClass =
  'transition-colors hover:text-teal focus-visible:text-teal focus-visible:outline-none';

export function SiteFooter() {
  return (
    <footer className="relative mt-16">
      <div aria-hidden className="h-px w-full bg-line" />
      <div className="column flex flex-col gap-10 pt-14 pb-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <nav aria-label="Sitemap">
            <p className="label mb-3">Pages</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-ui text-sm text-muted-foreground">
              {navItems.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={profile.repo} target="_blank" rel="noreferrer" className={linkClass}>
                  Source ↗
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="label">Contact</p>
            <CopyEmailButton />
            <a
              href={profile.phoneHref}
              className={`font-mono text-xs text-muted-foreground ${linkClass}`}
            >
              {profile.phone}
            </a>
            <FooterClock />
            <span className="flex items-center gap-2 font-ui text-xs text-muted-foreground">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-teal/60 motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-teal" />
              </span>
              {profile.status}
            </span>
          </div>
        </div>

        <Wordmark />

        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <span>© 2026 {profile.name}</span>
          <span className="flex items-center gap-3">
            <span>v{pkg.version}</span>
            {sha ? (
              <a
                href={`${profile.repo}/commit/${sha}`}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                {sha.slice(0, 7)}
              </a>
            ) : null}
          </span>
        </div>
      </div>
    </footer>
  );
}
