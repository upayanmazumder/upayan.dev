import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import * as z from 'zod';

import { ApiError, isApiError, toApiError } from '../errors';

describe('ApiError', () => {
  it('is an instance of Error', () => {
    const e = new ApiError({ message: 'fail', status: 400 });
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(ApiError);
  });

  it('exposes status, code, and details', () => {
    const e = new ApiError({ message: 'oops', status: 422, code: 'INVALID', details: { x: 1 } });
    expect(e.message).toBe('oops');
    expect(e.status).toBe(422);
    expect(e.code).toBe('INVALID');
    expect(e.details).toEqual({ x: 1 });
  });
});

describe('isApiError', () => {
  it('returns true for ApiError', () => {
    expect(isApiError(new ApiError({ message: 'x' }))).toBe(true);
  });

  it('returns false for a plain Error', () => {
    expect(isApiError(new Error('x'))).toBe(false);
  });

  it('returns false for non-errors', () => {
    expect(isApiError('string')).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});

describe('toApiError', () => {
  it('passes ApiError through unchanged', () => {
    const e = new ApiError({ message: 'x' });
    expect(toApiError(e)).toBe(e);
  });

  it('converts AxiosError with response data', () => {
    const axiosErr = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
    Object.defineProperty(axiosErr, 'response', {
      value: { status: 404, data: { message: 'Not found', code: 'NOT_FOUND' } },
    });
    const result = toApiError(axiosErr);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(404);
    expect(result.message).toBe('Not found');
    expect(result.code).toBe('NOT_FOUND');
  });

  it('converts AxiosError without response', () => {
    const axiosErr = new AxiosError('Network Error');
    const result = toApiError(axiosErr);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe('Network Error');
  });

  it('converts a ZodError produced by schema parsing', () => {
    const parsed = z.string().min(10).safeParse('x');
    if (parsed.success) throw new Error('expected parse failure');
    const result = toApiError(parsed.error);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('VALIDATION_ERROR');
  });

  it('converts a plain Error', () => {
    const result = toApiError(new Error('boom'));
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe('boom');
  });

  it('converts unknown values', () => {
    const result = toApiError('something weird');
    expect(result).toBeInstanceOf(ApiError);
    expect(result.message).toBe('An unexpected error occurred');
  });
});
