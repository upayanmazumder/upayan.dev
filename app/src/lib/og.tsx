import type { ReactNode } from 'react';

export const ogSize = { width: 1200, height: 630 };

const OG_COLORS = {
  background: '#0b0d0e',
  surface: '#121517',
  line: 'rgba(255,255,255,0.08)',
  foreground: '#eef0f1',
  muted: '#9aa3a8',
  teal: '#5fd4b4',
} as const;

/** Fetches a TTF from Google Fonts. Satori needs TTF/OTF; css2 serves TTF when no browser UA is sent. */
async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}`
  ).then(res => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`OG font not found: ${family} ${weight}`);
  return fetch(url).then(res => res.arrayBuffer());
}

export async function loadOgFonts() {
  const [display, body, mono] = await Promise.all([
    loadGoogleFont('Red Hat Display', 600),
    loadGoogleFont('Red Hat Display', 400),
    loadGoogleFont('Red Hat Mono', 400),
  ]);
  return [
    { name: 'Display', data: display, weight: 600 as const, style: 'normal' as const },
    { name: 'Body', data: body, weight: 400 as const, style: 'normal' as const },
    { name: 'Mono', data: mono, weight: 400 as const, style: 'normal' as const },
  ];
}

interface OgFrameProps {
  /** Small uppercase line above the title, e.g. "Selected work". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Extra content under the description, e.g. metric chips. */
  children?: ReactNode;
}

/** Shared dark card: rails, teal glow, eyebrow, title, description, domain footer. Font families come from `loadOgFonts`. */
export function OgFrame({ eyebrow, title, description, children }: OgFrameProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        background: OG_COLORS.background,
        color: OG_COLORS.foreground,
        fontFamily: 'Body',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(60% 70% at 85% 0%, rgba(95,212,180,0.22), transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 96,
          right: 96,
          borderLeft: `1px solid ${OG_COLORS.line}`,
          borderRight: `1px solid ${OG_COLORS.line}`,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 144px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontFamily: 'Mono',
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: OG_COLORS.teal,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ fontFamily: 'Display', fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          {description ? (
            <div style={{ fontSize: 30, lineHeight: 1.35, color: OG_COLORS.muted, maxWidth: 860 }}>
              {description}
            </div>
          ) : null}
          {children}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Mono',
            fontSize: 22,
            color: OG_COLORS.muted,
          }}
        >
          <span>Upayan Mazumder</span>
          <span>upayan.dev</span>
        </div>
      </div>
    </div>
  );
}

export { OG_COLORS };
