import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { output as ZodOutput, ZodType } from 'zod';

import { api } from './client';
import { toApiError } from './errors';

export async function request<S extends ZodType>(
  config: AxiosRequestConfig & { schema: S; client?: AxiosInstance }
): Promise<ZodOutput<S>>;
export async function request<T = unknown>(
  config: AxiosRequestConfig & { client?: AxiosInstance }
): Promise<T>;
export async function request(
  config: AxiosRequestConfig & { schema?: ZodType; client?: AxiosInstance }
): Promise<unknown> {
  const { schema, client = api, ...axiosConfig } = config;
  const response = await client.request(axiosConfig);
  if (schema) {
    const result = schema.safeParse(response.data);
    if (!result.success) throw toApiError(result.error);
    return result.data;
  }
  return response.data;
}
