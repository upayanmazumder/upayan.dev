import * as z from 'zod';

export const emailSchema = z.email();
export const urlSchema = z.url();
export const uuidSchema = z.uuid();
export const nonEmptyStringSchema = z.string().min(1);
export const positiveIntSchema = z.number().int().positive();
export const idSchema = z.union([z.string().min(1), z.number().int().positive()]);
export const dateStringSchema = z.string().datetime();

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export function paginatedResponseSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      pageSize: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
    message: z.string().optional(),
  });
}
