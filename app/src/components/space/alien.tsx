import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

/** `up`: both arms overhead. `wave`: left arm up, right arm waves. `hip`: left arm up, right hand on the hip. `peek`: head and paws only, for a sign held in front of the body. */
export type AlienPose = 'up' | 'wave' | 'hip' | 'peek';

type Arm = 'up' | 'wave' | 'hip' | 'grip';

const ARMS: Record<AlienPose, readonly [Arm, Arm]> = {
  up: ['up', 'up'],
  wave: ['up', 'wave'],
  hip: ['up', 'hip'],
  peek: ['grip', 'grip'],
};

// Left arm only. The right arm is the same path mirrored about the centre line.
const ARM_PATH: Record<Arm, string> = {
  up: 'M9 13 L5 2',
  wave: 'M10.5 21 L3.5 13',
  hip: 'M10.5 21 L6.5 25 L10 28.5',
  grip: 'M8.5 15 Q5.5 17 5.5 20.5',
};

// Idle loops read their timing from CSS variables, so each alien in a crowd can run out of step.
const idle = 'motion-reduce:animate-none';

function AlienArm({ arm }: { arm: Arm }) {
  return (
    <g
      className={cn(
        arm === 'wave' &&
          `origin-[10.5px_21px] animate-[alien-wave_var(--alien-wave,1.6s)_ease-in-out_infinite] group-hover/alien:[animation-duration:0.5s] ${idle}`
      )}
    >
      <path
        d={ARM_PATH[arm]}
        stroke="var(--teal)"
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      {arm === 'wave' && <circle cx={3.2} cy={12.6} r={1.8} fill="var(--teal)" />}
      {arm === 'grip' && <circle cx={5.5} cy={21} r={2} fill="var(--teal)" />}
    </g>
  );
}

interface AlienFigureProps {
  pose?: AlienPose;
  /** Flip left and right, so the free arm is on the other side. */
  mirror?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A small green alien. It blinks and twitches its antennae now and then. With raised arms, place
 * the held item directly above it. Sized by width; the viewBox is 32 wide and 36 tall (`peek`: 23). Decorative only.
 */
export function AlienFigure({ pose = 'up', mirror = false, className, style }: AlienFigureProps) {
  const [left, right] = ARMS[pose];
  return (
    <svg
      aria-hidden
      viewBox={pose === 'peek' ? '0 0 32 23' : '0 0 32 36'}
      style={style}
      className={cn('pointer-events-none overflow-visible', mirror && '-scale-x-100', className)}
    >
      <g
        className={`origin-bottom animate-[alien-wiggle_var(--alien-wiggle,6s)_ease-in-out_infinite] [animation-delay:var(--alien-wiggle-delay,0s)] [transform-box:fill-box] ${idle}`}
      >
        <path
          d="M12 6 L11 1 M20 6 L21 1"
          stroke="var(--teal)"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
        <circle cx={11} cy={1} r={1.4} fill="var(--accent-foreground)" />
        <circle cx={21} cy={1} r={1.4} fill="var(--accent-foreground)" />
      </g>
      {pose !== 'peek' && (
        <>
          <path d="M11 20 Q16 18 21 20 L22 30 Q16 32 10 30 Z" fill="var(--teal)" opacity={0.85} />
          <path
            d="M12 30 L11 35 M20 30 L21 35"
            stroke="var(--teal)"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </>
      )}
      <AlienArm arm={left} />
      <g transform="matrix(-1 0 0 1 32 0)">
        <AlienArm arm={right} />
      </g>
      <ellipse cx={16} cy={12} rx={8.5} ry={7.5} fill="var(--teal)" />
      <g
        className={`origin-center animate-[alien-blink_var(--alien-blink,5s)_linear_infinite] [animation-delay:var(--alien-blink-delay,0s)] [transform-box:fill-box] ${idle}`}
      >
        <ellipse cx={12.6} cy={12} rx={2.6} ry={3.2} fill="var(--background)" />
        <ellipse cx={19.4} cy={12} rx={2.6} ry={3.2} fill="var(--background)" />
        <circle cx={13.2} cy={11} r={0.9} fill="white" />
        <circle cx={20} cy={11} r={0.9} fill="white" />
      </g>
    </svg>
  );
}
