import { describe, expect, it } from 'vitest';
import * as z from 'zod';

import {
  emailSchema,
  idSchema,
  nonEmptyStringSchema,
  paginatedResponseSchema,
  paginationSchema,
  positiveIntSchema,
  uuidSchema,
} from '../common';

describe('emailSchema', () => {
  it('accepts a valid email', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('uuidSchema', () => {
  it('accepts a valid UUID', () => {
    expect(uuidSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true);
  });

  it('rejects a non-UUID string', () => {
    expect(uuidSchema.safeParse('not-a-uuid').success).toBe(false);
  });
});

describe('nonEmptyStringSchema', () => {
  it('accepts a non-empty string', () => {
    expect(nonEmptyStringSchema.safeParse('hello').success).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(nonEmptyStringSchema.safeParse('').success).toBe(false);
  });
});

describe('positiveIntSchema', () => {
  it('accepts a positive integer', () => {
    expect(positiveIntSchema.safeParse(5).success).toBe(true);
  });

  it('rejects zero', () => {
    expect(positiveIntSchema.safeParse(0).success).toBe(false);
  });

  it('rejects a float', () => {
    expect(positiveIntSchema.safeParse(1.5).success).toBe(false);
  });
});

describe('idSchema', () => {
  it('accepts a non-empty string id', () => {
    expect(idSchema.safeParse('abc-123').success).toBe(true);
  });

  it('accepts a positive integer id', () => {
    expect(idSchema.safeParse(42).success).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(idSchema.safeParse('').success).toBe(false);
  });
});

describe('paginationSchema', () => {
  it('applies defaults when input is empty', () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('accepts valid pagination values', () => {
    expect(paginationSchema.safeParse({ page: 3, pageSize: 50 }).success).toBe(true);
  });

  it('rejects pageSize over 100', () => {
    expect(paginationSchema.safeParse({ page: 1, pageSize: 101 }).success).toBe(false);
  });

  it('rejects page less than 1', () => {
    expect(paginationSchema.safeParse({ page: 0, pageSize: 10 }).success).toBe(false);
  });
});

describe('paginatedResponseSchema', () => {
  it('parses a valid paginated response', () => {
    const schema = paginatedResponseSchema(z.string());
    const result = schema.parse({
      data: ['a', 'b'],
      pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
    });
    expect(result.data).toEqual(['a', 'b']);
    expect(result.pagination.total).toBe(2);
  });

  it('rejects mismatched item types', () => {
    const schema = paginatedResponseSchema(z.number());
    expect(
      schema.safeParse({
        data: ['not-a-number'],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
      }).success
    ).toBe(false);
  });
});
