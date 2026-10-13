import { ImageResponse } from 'next/og';

import { featuredProjects } from '@/data/projects';
import { loadOgFonts, OG_COLORS, OgFrame, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Project case study by Upayan Mazumder';

export function generateStaticParams() {
  return featuredProjects.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = featuredProjects.find(p => p.slug === slug)!;

  return new ImageResponse(
    <OgFrame
      eyebrow={`${project.org ? `${project.org} · ` : ''}Selected work`}
      title={project.name}
      description={project.summary}
    >
      {project.metrics.length > 0 ? (
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {project.metrics.map(metric => (
            <div
              key={metric.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 999,
                border: `1px solid ${OG_COLORS.line}`,
                background: OG_COLORS.surface,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  fontFamily: 'Mono',
                  fontSize: 30,
                  color: OG_COLORS.foreground,
                }}
              >
                {metric.value}
                <span style={{ color: OG_COLORS.teal }}>{metric.suffix ?? ''}</span>
              </span>
              <span style={{ fontSize: 22, color: OG_COLORS.muted }}>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </OgFrame>,
    { ...size, fonts: await loadOgFonts() }
  );
}
