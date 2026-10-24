import { describe, expect, it, vi } from 'vitest';

import { fetchLatestTag } from '../fetch-latest-tag';

describe('fetchLatestTag', () => {
  it('returns the latest published release tag', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ tag_name: 'v5.1.1' }), { status: 200 }));

    expect(await fetchLatestTag(fetchImpl)).toBe('v5.1.1');
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.github.com/repos/upayanmazumder/upayan.dev/releases/latest',
      expect.objectContaining({ next: { revalidate: 3600 } })
    );
  });

  it('does not present a stale tag when GitHub fails', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }));
    expect(await fetchLatestTag(fetchImpl)).toBeNull();
  });

  it('rejects an invalid release response', async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ tag_name: '' }), { status: 200 }));
    expect(await fetchLatestTag(fetchImpl)).toBeNull();
  });
});
