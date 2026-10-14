import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Not found' };

export default function NotFound() {
  return (
    <section className="column flex min-h-[80dvh] flex-col justify-center gap-6 py-24">
      <p className="font-mono text-sm text-teal">404</p>
      <h1 className="text-4xl font-semibold md:text-6xl">This page does not exist.</h1>
      <p className="max-w-prose text-muted-foreground">
        The link may be old, or the page moved during the redesign.
      </p>
      <div className="flex flex-wrap gap-3 font-ui text-sm">
        <Link
          href="/"
          className="rounded-full border border-line-strong px-4 py-2 transition-colors hover:border-teal hover:text-teal"
        >
          Go home
        </Link>
        <Link
          href="/#projects"
          className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          See projects
        </Link>
      </div>
    </section>
  );
}
