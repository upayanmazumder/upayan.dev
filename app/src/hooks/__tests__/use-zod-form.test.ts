import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import * as z from 'zod';

import { useZodForm } from '../use-zod-form';

const schema = z.object({ name: z.string().min(1), age: z.number().int().positive() });

describe('useZodForm', () => {
  it('returns a form with register and handleSubmit', () => {
    const { result } = renderHook(() => useZodForm(schema));
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.handleSubmit).toBe('function');
    expect(typeof result.current.formState).toBe('object');
  });

  it('accepts default values via options', () => {
    const { result } = renderHook(() =>
      useZodForm(schema, { defaultValues: { name: 'Alice', age: 30 } })
    );
    expect(result.current.getValues('name')).toBe('Alice');
  });
});
