import { Asteroid } from './asteroid';
import { Astronaut } from './astronaut';

// Meteors streak along their own x-axis; the line is turned so that axis points down and left.
const METEORS = [
  { top: '6%', left: '78%', delay: '0.2s', width: 'w-28' },
  { top: '-4%', left: '52%', delay: '1.1s', width: 'w-20' },
  { top: '18%', left: '96%', delay: '1.9s', width: 'w-32' },
  { top: '-2%', left: '88%', delay: '2.7s', width: 'w-16' },
];

const ASTEROIDS = [
  { top: '20%', left: '10%', width: 'w-10', duration: '26s' },
  { top: '64%', left: '80%', width: 'w-14', duration: '34s' },
  { top: '12%', left: '66%', width: 'w-6', duration: '20s' },
  { top: '82%', left: '30%', width: 'w-8', duration: '28s' },
];

const ASTRONAUTS = [
  { top: '66%', left: '14%', width: 'w-10', duration: '7s', flip: false },
  { top: '24%', left: '84%', width: 'w-8', duration: '9s', flip: true },
];

/**
 * Scenery for the preloader: meteors streaking down from the top right, slowly tumbling asteroids,
 * and two astronauts drifting in place. Transform and opacity animations only; hidden entirely with
 * reduced motion, where the preloader does not run anyway.
 */
export function DeepSpace() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      {METEORS.map(meteor => (
        <span
          key={meteor.delay}
          className="absolute rotate-[156deg]"
          style={{ top: meteor.top, left: meteor.left }}
        >
          <span
            className={`block h-px ${meteor.width} animate-[meteor_3.2s_ease-in_infinite] bg-linear-to-r from-transparent via-white/40 to-white opacity-0`}
            style={{ animationDelay: meteor.delay }}
          />
        </span>
      ))}
      {ASTEROIDS.map(rock => (
        <span
          key={rock.top + rock.left}
          className={`absolute ${rock.width} animate-[asteroid-drift_linear_infinite] opacity-90`}
          style={{ top: rock.top, left: rock.left, animationDuration: rock.duration }}
        >
          <Asteroid className="w-full" />
        </span>
      ))}
      {ASTRONAUTS.map(astronaut => (
        <span
          key={astronaut.top}
          className={`absolute ${astronaut.width} ${astronaut.flip ? '-scale-x-100' : ''}`}
          style={{ top: astronaut.top, left: astronaut.left }}
        >
          <span
            className="block animate-[astronaut-float_ease-in-out_infinite]"
            style={{ animationDuration: astronaut.duration }}
          >
            <Astronaut className="w-full" />
          </span>
        </span>
      ))}
    </div>
  );
}
