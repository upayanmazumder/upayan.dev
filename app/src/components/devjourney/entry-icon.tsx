import {
  File,
  FileArchive,
  FileAudio,
  FileBraces,
  FileCode,
  FileCog,
  FileImage,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  FileVideo,
  Folder,
  Link2,
  Package,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import type { RepoEntry } from './contents';
import { extensionOf } from './paths';

const ICON_BY_EXTENSION: Record<string, LucideIcon> = {
  md: FileText,
  mdx: FileText,
  txt: FileText,
  pdf: FileText,
  rst: FileText,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  webp: FileImage,
  svg: FileImage,
  avif: FileImage,
  ico: FileImage,
  json: FileBraces,
  ipynb: FileBraces,
  yml: FileCog,
  yaml: FileCog,
  toml: FileCog,
  ini: FileCog,
  env: FileCog,
  lock: FileCog,
  sh: FileTerminal,
  bash: FileTerminal,
  zsh: FileTerminal,
  ps1: FileTerminal,
  bat: FileTerminal,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  tsv: FileSpreadsheet,
  zip: FileArchive,
  gz: FileArchive,
  tar: FileArchive,
  rar: FileArchive,
  '7z': FileArchive,
  jar: FileArchive,
  mp3: FileAudio,
  wav: FileAudio,
  ogg: FileAudio,
  mp4: FileVideo,
  mov: FileVideo,
  webm: FileVideo,
};

interface EntryIconProps {
  entry: Pick<RepoEntry, 'name' | 'type'>;
  className?: string;
}

export function EntryIcon({ entry, className }: EntryIconProps) {
  const Icon =
    entry.type === 'dir'
      ? Folder
      : entry.type === 'submodule'
        ? Package
        : entry.type === 'symlink'
          ? Link2
          : (ICON_BY_EXTENSION[extensionOf(entry.name)] ??
            (extensionOf(entry.name) ? FileCode : File));
  return (
    <Icon
      aria-hidden
      className={cn(
        'size-4 shrink-0',
        entry.type === 'dir' ? 'text-foreground' : 'text-muted-foreground',
        className
      )}
    />
  );
}
