import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QueryProvider } from '../query-provider';

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <div>query child</div>
      </QueryProvider>
    );
    expect(screen.getByText('query child')).toBeInTheDocument();
  });
});
