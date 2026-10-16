'use client';

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
}

function parseHSL(hslStr: string): { h: number; s: number; l: number } {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildBoxShadow(glowColor: string, intensity: number): string {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number, number, number, number, number, boolean][] = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(', ');
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x: number) {
  return x * x * x;
}

interface AnimateOpts {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (t: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
}

// Local change: returns a cancel function so an unmount mid-sweep stops the frame chain.
function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOpts): () => void {
  let frame = 0;
  const t0 = performance.now() + delay;
  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) frame = requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }
  const timer = setTimeout(() => {
    frame = requestAnimationFrame(tick);
  }, delay);
  return () => {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}

const GRADIENT_POSITIONS = [
  '80% 55%',
  '69% 34%',
  '8% 6%',
  '41% 38%',
  '86% 85%',
  '82% 18%',
  '51% 4%',
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors: string[]): string[] {
  const gradients: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

function isLightColor(color: string): boolean {
  const value = color.trim().replace('#', '');
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return false;
  const hex =
    value.length === 3
      ? value
          .split('')
          .map(char => char + char)
          .join('')
      : value;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return red * 0.2126 + green * 0.7152 + blue * 0.0722 > 180;
}

// Local change: transitions for the glow layers, swapped through `--glow-fade` instead of re-rendering.
const FADE_IN = '0.25s ease-out';
const FADE_OUT = '0.75s ease-in-out';

/** Local change: pointer state is written to CSS variables on the card, never to React state. */
function paintGlow(card: HTMLElement, angle: number, proximity: number, edgeSensitivity: number) {
  const edge = proximity * 100;
  const colorSensitivity = edgeSensitivity + 20;
  const border = Math.max(0, (edge - colorSensitivity) / (100 - colorSensitivity));
  const outer = Math.max(0, (edge - edgeSensitivity) / (100 - edgeSensitivity));
  card.style.setProperty('--glow-angle', `${angle.toFixed(2)}deg`);
  card.style.setProperty('--glow-border', border.toFixed(3));
  card.style.setProperty('--glow-outer', outer.toFixed(3));
}

function hideGlow(card: HTMLElement) {
  card.style.setProperty('--glow-fade', FADE_OUT);
  card.style.setProperty('--glow-border', '0');
  card.style.setProperty('--glow-outer', '0');
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '40 80 80',
  backgroundColor = '#120F17',
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  fillOpacity = 0.5,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  // Local change: one rAF per frame at most; pointer moves in between only update the stored point.
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });
  const sweepingRef = useRef(false);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    pointRef.current.x = e.clientX;
    pointRef.current.y = e.clientY;
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = pointRef.current.x - rect.left - cx;
      const dy = pointRef.current.y - rect.top - cy;
      const kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
      const ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
      const proximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      paintGlow(card, angle, proximity, edgeSensitivity);
    });
  };

  const handlePointerEnter = () => {
    cardRef.current?.style.setProperty('--glow-fade', FADE_IN);
  };

  const handlePointerLeave = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    const card = cardRef.current;
    if (card && !sweepingRef.current) hideGlow(card);
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card) return;
    const angleStart = 110;
    const angleEnd = 465;
    let angle = angleStart;
    let proximity = 0;
    const paint = () => paintGlow(card, angle, proximity, edgeSensitivity);

    sweepingRef.current = true;
    card.style.setProperty('--glow-fade', FADE_IN);
    const cancels = [
      animateValue({
        duration: 500,
        onUpdate: v => {
          proximity = v / 100;
          paint();
        },
      }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: v => {
          angle = (angleEnd - angleStart) * (v / 100) + angleStart;
          paint();
        },
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: v => {
          angle = (angleEnd - angleStart) * (v / 100) + angleStart;
          paint();
        },
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: v => {
          proximity = v / 100;
          paint();
        },
        onEnd: () => {
          sweepingRef.current = false;
          hideGlow(card);
        },
      }),
    ];
    return () => {
      cancels.forEach(cancel => cancel());
      sweepingRef.current = false;
    };
  }, [animated, edgeSensitivity]);

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map(g => `${g} border-box`);
  const fillBg = meshGradients.map(g => `${g} padding-box`);
  const cone = (stops: string) => `conic-gradient(from var(--glow-angle) at center, ${stops})`;
  const borderMask = cone(
    `black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%`
  );
  const fillMask = [
    'linear-gradient(to bottom, black, black)',
    'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
    'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
    'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
    cone('transparent 5%, black 15%, black 85%, transparent 95%'),
  ].join(', ');
  const outerMask = cone('black 2.5%, transparent 10%, transparent 90%, black 97.5%');
  const transition = 'opacity var(--glow-fade)';
  const lightSurface = isLightColor(backgroundColor);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative isolate grid border ${className}`}
      style={
        {
          '--glow-angle': '45deg',
          '--glow-border': '0',
          '--glow-outer': '0',
          '--glow-fade': FADE_OUT,
          background: backgroundColor,
          borderColor: lightSurface ? 'rgb(24 24 27 / 12%)' : 'rgb(255 255 255 / 15%)',
          borderRadius: `${borderRadius}px`,
          transform: 'translate3d(0, 0, 0.01px)',
          boxShadow: lightSurface
            ? 'rgb(24 24 27 / 4%) 0 1px 2px, rgb(24 24 27 / 5%) 0 8px 24px'
            : 'rgba(0,0,0,0.1) 0 1px 2px, rgba(0,0,0,0.1) 0 2px 4px, rgba(0,0,0,0.1) 0 4px 8px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 16px 32px, rgba(0,0,0,0.1) 0 32px 64px',
        } as CSSProperties
      }
    >
      {/* mesh gradient border */}
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={{
          border: '1px solid transparent',
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...borderBg,
          ].join(', '),
          opacity: 'var(--glow-border)',
          maskImage: borderMask,
          WebkitMaskImage: borderMask,
          transition,
        }}
      />

      {/* mesh gradient fill near edges */}
      <div
        className="absolute inset-0 -z-[1] rounded-[inherit]"
        style={
          {
            border: '1px solid transparent',
            background: fillBg.join(', '),
            maskImage: fillMask,
            WebkitMaskImage: fillMask,
            maskComposite: 'subtract, add, add, add, add, add',
            WebkitMaskComposite:
              'source-out, source-over, source-over, source-over, source-over, source-over',
            opacity: `calc(var(--glow-border) * ${fillOpacity})`,
            mixBlendMode: lightSurface ? 'normal' : 'soft-light',
            transition,
          } as CSSProperties
        }
      />

      {/* outer glow */}
      <span
        className="pointer-events-none absolute z-[1] rounded-[inherit]"
        style={
          {
            inset: `${-glowRadius}px`,
            maskImage: outerMask,
            WebkitMaskImage: outerMask,
            opacity: 'var(--glow-outer)',
            mixBlendMode: lightSurface ? 'normal' : 'plus-lighter',
            transition,
          } as CSSProperties
        }
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: buildBoxShadow(glowColor, glowIntensity),
          }}
        />
      </span>

      <div className="relative z-[1] flex flex-col overflow-auto">{children}</div>
    </div>
  );
};

export default BorderGlow;
