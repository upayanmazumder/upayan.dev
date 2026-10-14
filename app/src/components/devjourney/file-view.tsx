import { ArrowUpRight, Download } from 'lucide-react';

import { CodeBlock } from './code-block';
import type { RepoFile } from './contents';
import { CopyButton } from './copy-button';
import { EntryIcon } from './entry-icon';
import { MarkdownView } from './markdown-view';
import { fileKind, formatBytes, languageFor } from './paths';
import { actionClass } from './styles';

interface FileViewProps {
  file: RepoFile;
}

// Highlighting very large files on the server is slow and unreadable in the browser.
const MAX_PREVIEW_BYTES = 256 * 1024;

type Body =
  | { kind: 'image' }
  | { kind: 'markdown'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'download'; reason: string };

function bodyFor(file: RepoFile): Body {
  const kind = fileKind(file.name);
  if (kind === 'image') return { kind: 'image' };
  if (kind === 'binary')
    return { kind: 'download', reason: 'This file type cannot be shown here.' };
  if (file.size > MAX_PREVIEW_BYTES || file.encoding !== 'base64' || file.content === undefined) {
    return { kind: 'download', reason: 'This file is too large to preview.' };
  }
  const bytes = Buffer.from(file.content, 'base64');
  if (bytes.subarray(0, 8000).includes(0)) {
    return { kind: 'download', reason: 'This file is binary and cannot be shown here.' };
  }
  const text = bytes.toString('utf8');
  return kind === 'markdown' ? { kind: 'markdown', text } : { kind: 'text', text };
}

export function FileView({ file }: FileViewProps) {
  const body = bodyFor(file);
  const language = languageFor(file.name);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <EntryIcon entry={file} />
          <h1 className="truncate font-mono text-sm font-medium tracking-normal">{file.name}</h1>
          <span className="font-mono text-xs text-muted-foreground">{formatBytes(file.size)}</span>
          {body.kind === 'text' ? <span className="label hidden sm:inline">{language}</span> : null}
        </div>
        <div className="flex items-center gap-2">
          {body.kind === 'text' || body.kind === 'markdown' ? (
            <CopyButton text={body.text} />
          ) : null}
          {file.download_url && body.kind !== 'download' ? (
            <a href={file.download_url} target="_blank" rel="noreferrer" className={actionClass}>
              Raw
            </a>
          ) : null}
          {file.html_url ? (
            <a href={file.html_url} target="_blank" rel="noreferrer" className={actionClass}>
              Open on GitHub
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          ) : null}
        </div>
      </header>

      {body.kind === 'text' ? <CodeBlock code={body.text} language={language} /> : null}
      {body.kind === 'markdown' ? (
        <MarkdownView source={body.text} path={file.path} downloadUrl={file.download_url} />
      ) : null}
      {body.kind === 'image' && file.download_url ? (
        <div className="grid place-items-center p-6 md:p-10">
          {/* Repo images are remote and unsized, so next/image does not fit here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={file.download_url}
            alt={file.name}
            className="max-h-[70vh] max-w-full rounded-lg border border-line"
          />
        </div>
      ) : null}
      {body.kind === 'download' || (body.kind === 'image' && !file.download_url) ? (
        <div className="flex flex-col items-center gap-4 px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {body.kind === 'download' ? body.reason : 'This image has no download link.'}
          </p>
          {file.download_url ? (
            <a href={file.download_url} download={file.name} className={actionClass}>
              <Download aria-hidden className="size-3.5" />
              Download {file.name}
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
