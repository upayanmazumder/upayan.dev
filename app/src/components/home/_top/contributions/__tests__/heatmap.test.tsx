import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Heatmap } from '../heatmap';

vi.mock('@/lib/gsap', () => ({ useGSAP: () => {}, gsap: {} }));
vi.mock('../use-fit-weeks', () => ({ WEEK_GAP: 3, useFitWeeks: () => ({ cell: 10, start: 0 }) }));

const weeks = [
  {
    days: [
      { date: '2026-10-11', count: 1, level: 1 },
      { date: '2026-10-12', count: 2, level: 2 },
    ],
  },
  { days: [{ date: '2026-10-18', count: 3, level: 3 }] },
];

describe('Heatmap', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ addEventListener() {}, removeEventListener() {} }));
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      setTransform() {},
      clearRect() {},
      beginPath() {},
      roundRect() {},
      fill() {},
      strokeRect() {},
    } as unknown as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('exposes day counts as arrow keys move across weeks and rows', () => {
    render(<Heatmap weeks={weeks} />);
    const calendar = screen.getByRole('group', { name: /contribution calendar/i });
    const description = document.getElementById(calendar.getAttribute('aria-describedby')!);
    expect(description).toHaveTextContent('3 contributions on Sun, 18 Oct');

    calendar.focus();
    fireEvent.keyDown(calendar, { key: 'ArrowLeft' });
    expect(description).toHaveTextContent('1 contribution on Sun, 11 Oct');

    fireEvent.keyDown(calendar, { key: 'ArrowDown' });
    expect(description).toHaveTextContent('2 contributions on Mon, 12 Oct');
  });
});
