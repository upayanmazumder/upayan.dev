import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Label</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards arbitrary props to the underlying element', () => {
    render(<Button aria-label="close" />);
    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is set', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
