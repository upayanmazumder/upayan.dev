/** Home section anchors, in page order. Ids match the `Section` ids rendered by `@/components/home/*`. */
export const homeSections = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Selected work' },
  { id: 'open-source', label: 'Open source' },
  { id: 'more', label: 'More projects' },
  { id: 'work', label: 'Work' },
  { id: 'communities', label: 'Communities' },
  { id: 'elsewhere', label: 'Elsewhere' },
] as const;

export type TrailSide = 'left' | 'right';

/**
 * Margin the roadmap trail runs in beside a section: left for the first, then alternating. The
 * section heading sits on this side and margin tiles take the other, so both read it from here.
 */
export function trailSide(id: string): TrailSide {
  const index = homeSections.findIndex(section => section.id === id);
  return index % 2 === 0 ? 'left' : 'right';
}
