import { ArrowUpRight, CloudOff } from 'lucide-react';

import { REPO_URL } from './paths';
import { actionClass } from './styles';

interface UnavailableProps {
  reason: 'config' | 'upstream';
  path: string;
}

export function Unavailable({ reason, path }: UnavailableProps) {
  const githubHref = path
    ? `${REPO_URL}/tree/HEAD/${path.split('/').map(encodeURIComponent).join('/')}`
    : REPO_URL;
  return (
    <div role="status" className="flex flex-col items-center gap-4 px-6 py-20 text-center">
      <span className="grid size-11 place-items-center rounded-full border border-line bg-surface-2">
        <CloudOff aria-hidden className="size-5 text-muted-foreground" />
      </span>
      <div className="flex flex-col gap-1.5">
        <p className="font-semibold">The file browser is unavailable right now.</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          {reason === 'config'
            ? 'This copy of the site is not connected to the repository.'
            : 'GitHub did not answer. Try again in a few minutes.'}{' '}
          The code is still on GitHub.
        </p>
      </div>
      <a href={githubHref} target="_blank" rel="noreferrer" className={actionClass}>
        Open DevJourney on GitHub
        <ArrowUpRight aria-hidden className="size-3.5" />
      </a>
    </div>
  );
}
