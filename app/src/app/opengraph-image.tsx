import { ImageResponse } from 'next/og';

import { profile } from '@/data/profile';
import { loadOgFonts, OgFrame, ogSize } from '@/lib/og';

export const alt = `${profile.name} · ${profile.role}`;
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <OgFrame eyebrow={profile.role} title={profile.name} description={profile.sentence} />,
    { ...ogSize, fonts: await loadOgFonts() }
  );
}
