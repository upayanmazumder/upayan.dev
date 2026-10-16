import { isValidElement, type ReactElement, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { CodeBlock } from './code-block';
import { hrefFor, parentOf, pathFromSegments } from './paths';

interface MarkdownViewProps {
  source: string;
  /** Repo path of the Markdown file, used to resolve relative links. */
  path: string;
  /** Raw URL of the Markdown file, used to resolve relative images. */
  downloadUrl: string | null;
}

const SCHEME = /^[a-z][a-z\d+.-]*:/i;

/** Relative repo links stay inside DevJourney; anchors and absolute URLs pass through. */
function resolveLink(href: string, path: string): { href: string; external: boolean } {
  if (href.startsWith('#')) return { href, external: false };
  if (SCHEME.test(href) || href.startsWith('//')) return { href, external: true };
  const base = `https://repo.invalid/${parentOf(path) ? `${parentOf(path)}/` : ''}`;
  const url = new URL(href, base);
  const repoPath = pathFromSegments(url.pathname.split('/').filter(Boolean));
  return { href: `${hrefFor(repoPath)}${url.hash}`, external: false };
}

function codeChild(children: ReactNode): { code: string; language: string } {
  const child = isValidElement(children)
    ? (children as ReactElement<{ className?: string; children?: ReactNode }>)
    : null;
  const language = /language-([\w+-]+)/.exec(child?.props.className ?? '')?.[1] ?? 'text';
  return { code: String(child?.props.children ?? ''), language };
}

function buildComponents(path: string, downloadUrl: string | null): Components {
  return {
    h1: ({ children }) => (
      <h1 className="mt-2 mb-6 text-3xl font-semibold md:text-4xl">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 border-b border-line pb-2 text-2xl font-semibold first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>,
    h5: ({ children }) => <h5 className="mt-6 mb-2 font-semibold">{children}</h5>,
    h6: ({ children }) => <h6 className="label mt-6 mb-2">{children}</h6>,
    p: ({ children }) => <p className="my-4 leading-7 text-foreground/85">{children}</p>,
    a: ({ href = '', children }) => {
      const link = resolveLink(href, path);
      const className =
        'underline decoration-line-strong underline-offset-4 transition-colors hover:text-teal hover:decoration-teal';
      return link.external ? (
        <a href={link.href} target="_blank" rel="noreferrer" className={className}>
          {children}
        </a>
      ) : (
        <Link href={link.href} className={className}>
          {children}
        </Link>
      );
    },
    img: ({ src, alt }) => {
      if (typeof src !== 'string' || !src) return null;
      const resolved =
        SCHEME.test(src) || !downloadUrl ? src : new URL(src, downloadUrl).toString();
      // Repo images are remote and unsized, so next/image does not fit here.
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt ?? ''}
          loading="lazy"
          className="my-4 inline-block max-w-full rounded-lg"
        />
      );
    },
    ul: ({ children }) => (
      <ul className="my-4 list-disc space-y-1.5 pl-6 marker:text-muted-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 list-decimal space-y-1.5 pl-6 marker:font-mono marker:text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7 text-foreground/85">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-line-strong pl-4 text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-line" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-line">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-line bg-surface-2 px-3 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top">{children}</td>,
    pre: ({ children }) => {
      const { code, language } = codeChild(children);
      return (
        <div className="my-6 overflow-hidden rounded-lg border border-line bg-background/60">
          <CodeBlock code={code} language={language} lineNumbers={false} />
        </div>
      );
    },
    code: ({ children }) => (
      <code className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {children}
      </code>
    ),
  };
}

/** GitHub-flavoured Markdown rendered on the server. Raw HTML is not rendered, so repo files cannot inject markup. */
export function MarkdownView({ source, path, downloadUrl }: MarkdownViewProps) {
  return (
    <article className="px-5 py-8 md:px-10 md:py-10">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={buildComponents(path, downloadUrl)}>
        {source}
      </ReactMarkdown>
    </article>
  );
}
