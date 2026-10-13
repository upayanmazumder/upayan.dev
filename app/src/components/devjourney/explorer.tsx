import { cn } from '@/lib/utils';

import { Breadcrumb } from './breadcrumb';
import { getContents, type Contents, type RepoEntry } from './contents';
import { DirectoryList } from './directory-list';
import { FileTree } from './file-tree';
import { FileView } from './file-view';
import { MarkdownView } from './markdown-view';
import { PaneReveal } from './pane-reveal';
import { parentOf } from './paths';
import { Unavailable } from './unavailable';

interface ExplorerProps {
  path: string;
  contents: Exclude<Contents, { status: 'missing' }>;
}

const README = /^readme\.(md|markdown)$/i;

async function siblingsOf(path: string): Promise<RepoEntry[] | null> {
  // At the root the content pane already lists everything, so the tree would only repeat it.
  if (!path) return null;
  const parent = await getContents(parentOf(path));
  return parent.status === 'dir' ? parent.entries : null;
}

async function DirectoryReadme({ entries }: { entries: RepoEntry[] }) {
  const entry = entries.find(item => item.type === 'file' && README.test(item.name));
  if (!entry) return null;
  const readme = await getContents(entry.path);
  if (readme.status !== 'file' || readme.file.encoding !== 'base64' || !readme.file.content)
    return null;
  return (
    <section
      aria-label={entry.name}
      className="mt-6 overflow-hidden rounded-xl border border-line bg-surface"
    >
      <p className="label border-b border-line px-5 py-3">{entry.name}</p>
      <MarkdownView
        source={Buffer.from(readme.file.content, 'base64').toString('utf8')}
        path={entry.path}
        downloadUrl={readme.file.download_url}
      />
    </section>
  );
}

export async function Explorer({ path, contents }: ExplorerProps) {
  const unavailable = contents.status === 'unavailable';
  const siblings = unavailable ? null : await siblingsOf(path);
  const isDir = contents.status === 'dir';

  return (
    <div className="mx-auto w-full max-w-6xl px-(--gutter) pt-24 pb-24 md:pt-32">
      <header className="mb-8 flex flex-col gap-3">
        <p className="label">
          <span className="text-teal">DevJourney</span> · code I wrote while learning
        </p>
        <Breadcrumb path={path} />
      </header>

      <div
        className={cn(
          'grid gap-6',
          siblings && 'md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)]'
        )}
      >
        {siblings ? (
          <aside
            className={cn(
              'max-md:order-last md:sticky md:top-8 md:max-h-[calc(100dvh-4rem)] md:self-start md:overflow-y-auto',
              isDir && 'max-md:hidden'
            )}
            data-lenis-prevent
          >
            <FileTree directory={parentOf(path)} entries={siblings} activePath={path} />
          </aside>
        ) : null}

        <PaneReveal key={path} className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            {contents.status === 'unavailable' ? (
              <Unavailable reason={contents.reason} path={path} />
            ) : null}
            {contents.status === 'file' ? <FileView file={contents.file} /> : null}
            {contents.status === 'dir' ? (
              <>
                <header className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3">
                  <h1 className="truncate font-mono text-sm font-medium tracking-normal">
                    {path ? path.split('/').at(-1) : 'DevJourney'}
                  </h1>
                  <span className="font-mono text-xs text-muted-foreground">
                    {contents.entries.length} {contents.entries.length === 1 ? 'item' : 'items'}
                  </span>
                </header>
                <DirectoryList entries={contents.entries} />
              </>
            ) : null}
          </div>
          {contents.status === 'dir' ? <DirectoryReadme entries={contents.entries} /> : null}
        </PaneReveal>
      </div>
    </div>
  );
}
