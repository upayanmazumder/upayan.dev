import { cn } from '@/lib/utils';

import { highlight } from './highlight';

interface CodeBlockProps {
  code: string;
  language: string;
  lineNumbers?: boolean;
  className?: string;
}

/** Shiki-highlighted code rendered on the server. Shiki escapes the source, so the HTML is safe to inject. */
export async function CodeBlock({ code, language, lineNumbers = true, className }: CodeBlockProps) {
  const html = await highlight(code.replace(/\n$/, ''), language, lineNumbers);
  return (
    <div
      className={cn(
        'font-mono text-[0.8125rem] leading-6',
        '[&_pre]:overflow-x-auto [&_pre]:py-4 [&_pre]:font-mono',
        lineNumbers ? '[&_pre]:pr-6' : '[&_pre]:px-5',
        '[&_.ln]:mr-5 [&_.ln]:inline-block [&_.ln]:w-12 [&_.ln]:pr-1 [&_.ln]:text-right [&_.ln]:text-muted-foreground/45 [&_.ln]:select-none',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
