'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { ZodType } from 'zod';

export function useZodForm<TValues extends FieldValues>(
  schema: ZodType<TValues>,
  options?: Omit<UseFormProps<TValues>, 'resolver'>
): UseFormReturn<TValues> {
  return useForm<TValues>({
    ...options,
    resolver: zodResolver(schema),
  });
}
