import type { CSSProperties } from 'react';

import type { AlienPose } from '@/components/space';

export type AlienStand = 'ground' | 'rock' | 'shoulders';

export interface AlienLook {
  pose: AlienPose;
  stand: AlienStand;
  /** Free arm on the right when false. */
  mirror: boolean;
  /** Width of the figure that holds the block, in rem. */
  size: number;
  /** Idle timing and lean as CSS variables, plus the distance the alien stands back from the front row. */
  style: CSSProperties;
}

// Each alien takes every third look, so neighbours never share one.
const LOOKS: readonly { pose: AlienPose; stand: AlienStand; lean: number }[] = [
  { pose: 'up', stand: 'ground', lean: 0 },
  { pose: 'wave', stand: 'ground', lean: 0 },
  { pose: 'peek', stand: 'ground', lean: 0 },
  { pose: 'up', stand: 'shoulders', lean: 0 },
  { pose: 'hip', stand: 'ground', lean: -7 },
  { pose: 'up', stand: 'rock', lean: 0 },
  { pose: 'wave', stand: 'rock', lean: 5 },
];

/** A stable value in [0, 1) for an index and a salt. Render must not use `Math.random`. */
export function noise(index: number, salt: number): number {
  let hash = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b);
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x2c1b3c6d);
  hash ^= hash >>> 12;
  return (hash >>> 0) / 2 ** 32;
}

const seconds = (value: number) => `${value.toFixed(2)}s`;

/** The pose, stand, size and idle rhythm of the alien at `index` in the ground crowd. */
export function alienLook(index: number): AlienLook {
  const { pose, stand, lean } = LOOKS[(index * 3) % LOOKS.length];
  const near = noise(index, 1);
  return {
    pose,
    stand,
    mirror: noise(index, 2) < 0.5,
    size: 1.45 + 0.6 * near,
    style: {
      // Smaller aliens stand further back, so they sit a little higher on the ground.
      marginBottom: `${((1 - near) * 0.6).toFixed(2)}rem`,
      zIndex: Math.round(near * 10),
      '--alien-lean': `${lean}deg`,
      '--alien-blink': seconds(3.5 + 3.5 * noise(index, 3)),
      '--alien-blink-delay': seconds(-6 * noise(index, 4)),
      '--alien-wiggle': seconds(4 + 4 * noise(index, 5)),
      '--alien-wiggle-delay': seconds(-8 * noise(index, 6)),
      '--alien-sway': seconds(2.8 + 1.8 * noise(index, 7)),
      '--alien-sway-delay': seconds(-5 * noise(index, 8)),
      '--alien-hop': seconds(8 + 8 * noise(index, 9)),
      '--alien-hop-delay': seconds(1.5 + 7 * noise(index, 10)),
      '--alien-wave': seconds(1.2 + 0.8 * noise(index, 11)),
    } as CSSProperties,
  };
}
