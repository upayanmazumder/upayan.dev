import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Not found' };

const linkClass =
  'text-foreground underline decoration-line-strong underline-offset-4 transition-colors hover:text-teal hover:decoration-teal focus-visible:text-teal';

export default function NotFound() {
  return (
    <section className="column flex min-h-[60dvh] flex-col justify-center gap-4 py-24">
      <p className="label">404</p>
      <h1 className="text-3xl md:text-4xl">This page does not exist.</h1>
      <p className="max-w-prose text-muted-foreground">
        The link may be old, or the page moved during the redesign.
      </p>
      <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link href="/" className={linkClass}>
          Go home
        </Link>
        <Link href="/#projects" className={linkClass}>
          See projects
        </Link>
      </p>
    </section>
  );
}
