import axios from 'axios';

import { API_TIMEOUT_MS } from '@/constants';
import { env } from '@/env';

import { toApiError } from './errors';

export function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: API_TIMEOUT_MS,
  });

  client.interceptors.response.use(
    response => response,
    error => Promise.reject(toApiError(error))
  );

  return client;
}

export const api = createApiClient(env.NEXT_PUBLIC_API_URL);
