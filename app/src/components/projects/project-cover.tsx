import Image from 'next/image';

import type { FeaturedProject } from '@/data/types';
import { cn } from '@/lib/utils';

interface ProjectCoverProps {
  project: Pick<FeaturedProject, 'name' | 'image' | 'metrics'>;
  className?: string;
  /** Larger icon and watermark for the case-study hero. */
  size?: 'card' | 'hero' | 'thumb';
  priority?: boolean;
}

/** Composed cover (no screenshots exist): icon on a deep surface, teal light, grain, and an outlined watermark. */
export function ProjectCover({ project, className, size = 'card', priority }: ProjectCoverProps) {
  const lead = project.metrics[0];
  const watermark = lead ? `${lead.value}${lead.suffix ?? ''}` : project.name;
  const icon = size === 'hero' ? 144 : size === 'thumb' ? 56 : 112;

  return (
    <div aria-hidden className={cn('relative isolate overflow-hidden bg-background', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_72%_18%,var(--teal-dim),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_60%_at_20%_110%,var(--teal-dim),transparent_75%)] opacity-60" />
      <span
        className={cn(
          'pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] font-display leading-none font-semibold tracking-tighter whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_var(--line-strong)]',
          size === 'thumb'
            ? 'text-6xl'
            : size === 'hero'
              ? 'text-[11rem] md:text-[15rem]'
              : 'text-[8rem] md:text-[11rem]'
        )}
      >
        {watermark}
      </span>
      <div
        data-cover-zoom
        className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out-expo"
      >
        <span className="relative">
          <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-teal/20 blur-3xl" />
          <Image
            src={encodeURI(project.image)}
            alt=""
            width={icon}
            height={icon}
            priority={priority}
            className="object-contain drop-shadow-[0_18px_30px_rgb(0_0_0/0.55)]"
          />
        </span>
      </div>
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-line" />
    </div>
  );
}
