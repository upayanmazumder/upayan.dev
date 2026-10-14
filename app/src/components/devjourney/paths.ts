export const REPO_URL = 'https://github.com/upayanmazumder/DevJourney';
export const ROOT_HREF = '/devjourney';

/** Site URL for a repo-relative path. Each segment is encoded so names with spaces or `#` stay linkable. */
export function hrefFor(path: string): string {
  return path ? `${ROOT_HREF}/${path.split('/').map(encodeURIComponent).join('/')}` : ROOT_HREF;
}

export function parentOf(path: string): string {
  const cut = path.lastIndexOf('/');
  return cut === -1 ? '' : path.slice(0, cut);
}

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** Joins catch-all params into a repo path, decoding segments the router left encoded. */
export function pathFromSegments(segments: string[] | undefined): string {
  return (segments ?? [])
    .map(segment => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    })
    .join('/');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type FileKind = 'image' | 'markdown' | 'binary' | 'text';

const KIND_BY_EXTENSION: Record<string, FileKind> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  avif: 'image',
  svg: 'image',
  ico: 'image',
  bmp: 'image',
  md: 'markdown',
  mdx: 'markdown',
  markdown: 'markdown',
  pdf: 'binary',
  zip: 'binary',
  gz: 'binary',
  tar: 'binary',
  rar: 'binary',
  '7z': 'binary',
  exe: 'binary',
  dll: 'binary',
  so: 'binary',
  o: 'binary',
  a: 'binary',
  class: 'binary',
  jar: 'binary',
  bin: 'binary',
  mp3: 'binary',
  mp4: 'binary',
  wav: 'binary',
  mov: 'binary',
  webm: 'binary',
  ogg: 'binary',
  ttf: 'binary',
  otf: 'binary',
  woff: 'binary',
  woff2: 'binary',
  pyc: 'binary',
  docx: 'binary',
  xlsx: 'binary',
  pptx: 'binary',
  sqlite: 'binary',
  db: 'binary',
};

export function fileKind(name: string): FileKind {
  return KIND_BY_EXTENSION[extensionOf(name)] ?? 'text';
}

const NAMED_LANGUAGES: Record<string, string> = {
  dockerfile: 'docker',
  makefile: 'make',
  cmakelists: 'cmake',
  '.gitignore': 'shellscript',
  '.env': 'dotenv',
};

const EXTENSION_LANGUAGES: Record<string, string> = {
  h: 'c',
  hpp: 'cpp',
  cc: 'cpp',
  mjs: 'js',
  cjs: 'js',
  txt: 'text',
  ipynb: 'json',
  lock: 'text',
};

/** Shiki language id guess; the highlighter falls back to plain text for unknown ids. */
export function languageFor(name: string): string {
  const lower = name.toLowerCase();
  const base = lower.replace(/\.txt$/, '');
  if (NAMED_LANGUAGES[base]) return NAMED_LANGUAGES[base];
  const ext = extensionOf(name);
  return EXTENSION_LANGUAGES[ext] ?? (ext || 'text');
}
