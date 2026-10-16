import Link from 'next/link';

import { otherSocials, primarySocials, profile } from '@/data/profile';
import { navItems } from '@/data/site';

import pkg from '../../../package.json';
import { CopyEmailButton } from './copy-email-button';
import { FooterClock } from './footer-clock';

const sha = process.env.VERCEL_GIT_COMMIT_SHA;
const socials = [...primarySocials, ...otherSocials];
const linkClass = 'transition-colors hover:text-teal focus-visible:text-teal';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="column flex flex-col gap-10 py-12">
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <nav aria-label="Sitemap">
            <p className="label mb-3">Pages</p>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              {navItems.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label mb-3">Contact</p>
            <ul className="flex flex-col items-start gap-2 text-muted-foreground">
              <li>
                <CopyEmailButton />
              </li>
              <li>
                <a href={profile.phoneHref} className={linkClass}>
                  {profile.phone}
                </a>
              </li>
              <li>
                <FooterClock />
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="size-2 rounded-full bg-teal" />
                {profile.status}
              </li>
            </ul>
          </div>

          <nav aria-label="Elsewhere">
            <p className="label mb-3">Elsewhere</p>
            <ul className="flex flex-col gap-2 text-muted-foreground">
              {socials.map(social => (
                <li key={social.id}>
                  <a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 font-mono text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span className="flex items-center gap-3 tabular-nums">
            <a href={profile.repo} target="_blank" rel="noreferrer" className={linkClass}>
              Source
            </a>
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
